import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { useMotion } from './MotionContext';

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
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  resetInitialProjects: () => void;
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

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProj, ...prev]);
    playFeedbackSound('success');
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
    playFeedbackSound('success');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    playFeedbackSound('click');
  };

  const resetInitialProjects = () => {
    setProjects(INITIAL_PROJECTS);
    try {
      localStorage.removeItem(PROJECTS_STORAGE_KEY);
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
