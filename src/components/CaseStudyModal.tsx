import React, { useEffect } from 'react';
import { Project } from '../types';
import { useMotion } from '../context/MotionContext';
import { X, ArrowUpRight, CheckCircle2, Calendar, User, Tag } from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onInquire: (serviceName: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onInquire }) => {
  const { playFeedbackSound } = useMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playFeedbackSound('click');
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          playFeedbackSound('click');
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all flex flex-col"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-hover)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(var(--bg-canvas), 0.9)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase">{project.category}</span>
            <span aria-hidden="true">/</span>
            <span>{project.year}</span>
          </div>

          <button
            onClick={() => {
              playFeedbackSound('click');
              onClose();
            }}
            aria-label="Close Case Study"
            className="p-1.5 rounded-lg border transition-colors hover:border-white/30 cursor-pointer"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Title & Metadata */}
          <div className="space-y-3">
            <h2
              id="case-study-title"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 opacity-60" />
                <span>Client: {project.client}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 opacity-60" />
                <span>Year: {project.year}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 opacity-60" />
                <span>{project.categoryLabel}</span>
              </div>
            </div>
          </div>

          {/* Full-width Image Showcase */}
          <div
            className="w-full rounded-xl overflow-hidden border aspect-[16/10] relative flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={e => {
                // Resilient fallback
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Case Study Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* The Challenge */}
            <div
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                The Challenge
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-main)]">
                {project.challenge}
              </p>
            </div>

            {/* Creative Concept */}
            <div
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Creative Concept
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-main)]">
                {project.concept}
              </p>
            </div>

            {/* Outcome & Impact */}
            <div
              className="p-5 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Outcome & Impact
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-main)]">
                {project.outcome}
              </p>
            </div>
          </div>

          {/* Deliverables List */}
          <div
            className="p-6 rounded-xl border space-y-3"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Delivered Assets & Specifications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-main)]">
                  <CheckCircle2 className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry CTA Footer */}
          <div
            className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-xs text-[var(--text-muted)]">
              Inspired by this work? We tailor bespoke design systems for discerning brands.
            </div>
            <button
              onClick={() => {
                playFeedbackSound('click');
                onClose();
                onInquire(project.categoryLabel);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--accent-focal)',
                color: 'var(--accent-inverted)',
              }}
            >
              <span>Commission Similar Work</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
