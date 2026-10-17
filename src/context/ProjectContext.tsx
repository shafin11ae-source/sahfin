import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { useMotion } from './MotionContext';
import {
  fetchProjectsFromFirestore,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  seedInitialProjectsToFirestore,
} from '../lib/firebase';

const PROJECTS_STORAGE_KEY = 'design_foundry_projects_data_v1';

interface ProjectContextValue {
  projects: Project[];
  activeCategory: ProjectCategory;
  setActiveCategory: (cat: ProjectCategory) => void;
  filteredProjects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  resetInitialProjects: () => void;
  isDbLoading: boolean;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playFeedbackSound } = useMotion();
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PROJECTS;
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Sync with Firestore database on initialization
  useEffect(() => {
    let isMounted = true;
    const loadFromDatabase = async () => {
      setIsDbLoading(true);
      try {
        const dbProjects = await fetchProjectsFromFirestore();
        if (!isMounted) return;
        if (dbProjects && dbProjects.length > 0) {
          setProjects(dbProjects);
          localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(dbProjects));
        } else {
          // First time initialization: seed into Firestore
          await seedInitialProjectsToFirestore(INITIAL_PROJECTS);
        }
      } catch (err) {
        console.warn('[Firebase] Database sync fallback to local cache:', err);
      } finally {
        if (isMounted) setIsDbLoading(false);
      }
    };

    loadFromDatabase();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProj, ...prev]);
    playFeedbackSound('success');

    // Persist to Firestore database
    try {
      await saveProjectToFirestore(newProj);
    } catch (err) {
      console.warn('[Firebase] Could not save project to Firestore:', err);
    }
  };

  const updateProject = async (updated: Project) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
    playFeedbackSound('success');

    // Persist to Firestore database
    try {
      await saveProjectToFirestore(updated);
    } catch (err) {
      console.warn('[Firebase] Could not update project in Firestore:', err);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    playFeedbackSound('click');

    // Delete from Firestore database
    try {
      await deleteProjectFromFirestore(id);
    } catch (err) {
      console.warn('[Firebase] Could not delete project from Firestore:', err);
    }
  };

  const resetInitialProjects = () => {
    setProjects(INITIAL_PROJECTS);
    try {
      localStorage.removeItem(PROJECTS_STORAGE_KEY);
      seedInitialProjectsToFirestore(INITIAL_PROJECTS);
    } catch {}
    playFeedbackSound('toggle');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeCategory,
        setActiveCategory,
        filteredProjects,
        selectedProject,
        setSelectedProject,
        isAdminOpen,
        setIsAdminOpen,
        addProject,
        updateProject,
        deleteProject,
        resetInitialProjects,
        isDbLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
