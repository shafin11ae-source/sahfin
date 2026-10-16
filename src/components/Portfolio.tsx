import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useMotion } from '../context/MotionContext';
import { ProjectCategory } from '../types';
import { ArrowUpRight, FolderPlus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectAdminModal } from './ProjectAdminModal';
import { StudioAuthModal } from './StudioAuthModal';

interface PortfolioProps {
  onSelectServiceForInquiry: (service: string) => void;
}

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'branding', label: 'Branding' },
  { id: 'logos', label: 'Logos' },
  { id: 'posters', label: 'Posters' },
  { id: 'magazines', label: 'Magazines' },
  { id: 'websites', label: 'Websites' },
  { id: 'social', label: 'Social Media' },
  { id: 'packaging', label: 'Packaging' },
];

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectServiceForInquiry }) => {
  const { filteredProjects, activeCategory, setActiveCategory, selectedProject, setSelectedProject, setIsAdminOpen, isAdminOpen } = useProjects();
  const { settings, playFeedbackSound } = useMotion();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleInquireFromModal = (category: string) => {
    onSelectServiceForInquiry(category);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-24 border-t relative" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Curated Portfolio · Selected Works
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Forged With Precision
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Manage Portfolio studio button */}
            <button
              onClick={() => {
                playFeedbackSound('click');
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition-colors hover:border-white/40 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 opacity-70" />
              <span>Manage Projects</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (Segmented Controls compliant with zero-pill rule) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border mb-12" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playFeedbackSound('click');
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={() => playFeedbackSound('hover')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-focal)' : 'transparent',
                  color: isActive ? 'var(--accent-inverted)' : 'var(--text-main)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isWide = index === 0 && activeCategory === 'all';
            return (
              <div
                key={project.id}
                onClick={() => {
                  playFeedbackSound('click');
                  setSelectedProject(project);
                }}
                onMouseEnter={() => playFeedbackSound('hover')}
                className={`group cursor-pointer flex flex-col space-y-4 ${
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                {/* Visual Thumbnail Frame */}
                <div
                  className="w-full aspect-[4/3] rounded-2xl overflow-hidden border relative transition-all duration-300 group-hover:border-white/40 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    transform: settings.disableHoverMovement ? 'none' : 'translateZ(0)',
                  }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Hover Quick Indicator */}
                  <div
                    className="absolute bottom-4 right-4 p-2.5 rounded-full border backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(var(--bg-canvas), 0.85)',
                      borderColor: 'var(--border-hover)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                    <span className="uppercase">{project.categoryLabel}</span>
                    <span className="tabular-nums">{project.year}</span>
                  </div>

                  <h3
                    className="text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--text-main)]"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {project.concept}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <p className="text-sm text-[var(--text-muted)]">No projects found in this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-semibold uppercase tracking-wider underline cursor-pointer"
              style={{ color: 'var(--text-main)' }}
            >
              View All Projects
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal Lightbox */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={handleInquireFromModal}
      />

      {/* Project Admin Modal */}
      {isAdminOpen && <ProjectAdminModal onClose={() => setIsAdminOpen(false)} />}

      {/* Studio Password Security Gate */}
      <StudioAuthModal
        isOpen={showAuthModal}
        targetTitle="Manage Portfolio Projects"
        onSuccess={() => setIsAdminOpen(true)}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
};
