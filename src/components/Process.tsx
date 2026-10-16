import React, { useState } from 'react';
import { useMotion } from '../context/MotionContext';
import { CheckCircle2, ChevronRight, Eye, Lightbulb, PenTool, RefreshCw, Send } from 'lucide-react';

const STAGES = [
  {
    step: '01',
    name: 'Discover',
    tagline: 'Brand, Audience & Intent',
    description: 'We immerse ourselves in your brand history, competitive landscape, target demographics, and strategic milestones to establish an airtight brief and clear creative parameters.',
    milestones: ['Deep Stakeholder Briefing', 'Market & Aesthetic Audit', 'Design Objective Matrix', 'Target Persona Archetypes'],
    icon: Eye,
  },
  {
    step: '02',
    name: 'Strategize',
    tagline: 'Concept & Visual Architecture',
    description: 'Before drawing a single vector, we synthesize divergent conceptual paths, mood boards, typographic specimens, and spatial hierarchies to define the strategic creative North Star.',
    milestones: ['Aesthetic Mood Direction', 'Typography Systems Exploration', 'Materiality & Stock Matrix', 'Creative Strategy Manifesto'],
    icon: Lightbulb,
  },
  {
    step: '03',
    name: 'Design',
    tagline: 'Vector Craft & Exploration',
    description: 'We execute the chosen creative direction with rigorous mathematical geometry, optical balance, custom logotypes, editorial grids, and anti-gravity motion interactions.',
    milestones: ['Primary Vector Symbol Construction', 'Grid Layout Orchestration', '3D / Tactile Prototyping', 'Interactive Motion Tests'],
    icon: PenTool,
  },
  {
    step: '04',
    name: 'Refine',
    tagline: 'Collaborative Iteration',
    description: 'We conduct structured feedback cycles with high-resolution prototypes and real-world mockups, testing legibility across physical substrates and diverse digital viewports.',
    milestones: ['Structured Revision Rounds', 'Substrate Proofing Tests', 'Cross-Platform Viewport Audit', 'Accessibility & Contrast Checks'],
    icon: RefreshCw,
  },
  {
    step: '05',
    name: 'Deliver',
    tagline: 'Master Production Assets',
    description: 'We package the finalized design deliverables with complete vector source files, production-ready print dielines, design tokens, and comprehensive master brand guidelines.',
    milestones: ['Vector Masters (.SVG, .EPS, .AI)', 'Pre-Press Print Packages', 'Web Components & Tokens', 'Comprehensive Style Guideline'],
    icon: Send,
  },
];

export const Process: React.FC = () => {
  const { playFeedbackSound } = useMotion();
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const currentStage = STAGES[selectedStepIndex];

  return (
    <section id="process" className="py-24 border-t relative" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Workflow · 5-Stage Methodology
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              The Creative Process
            </h2>
          </div>
          <p className="text-sm md:text-base max-w-md text-[var(--text-muted)] leading-relaxed">
            From initial conceptual archaeology to the delivery of pristine vector masters and tactile substrates. A disciplined, transparent path to visual excellence.
          </p>
        </div>

        {/* Step Progress Scrubber Bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {STAGES.map((stg, idx) => {
            const isSelected = selectedStepIndex === idx;
            return (
              <button
                key={stg.step}
                onClick={() => {
                  playFeedbackSound('click');
                  setSelectedStepIndex(idx);
                }}
                className={`py-3 px-3 rounded-lg text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'shadow-xs font-semibold' : 'hover:opacity-100 opacity-60'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-focal)' : 'transparent',
                  color: isSelected ? 'var(--accent-inverted)' : 'var(--text-main)',
                }}
              >
                <div className="text-[11px] font-mono tabular-nums opacity-75">
                  Stage {stg.step}
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-tight truncate mt-1">
                  {stg.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Detailed Stage Showcase */}
        <div
          className="p-8 md:p-12 rounded-2xl border relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hover)',
          }}
        >
          {/* Subtle stage watermark numbering in background */}
          <div
            className="absolute top-4 right-8 text-7xl md:text-9xl font-mono font-black opacity-5 pointer-events-none select-none tabular-nums"
            style={{ color: 'var(--text-main)' }}
          >
            {currentStage.step}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left detail description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--accent-focal)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Stage {currentStage.step}
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  {currentStage.tagline}
                </span>
              </div>

              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
              >
                {currentStage.name}
              </h3>

              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
                {currentStage.description}
              </p>

              {/* Progress controller buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  disabled={selectedStepIndex === 0}
                  onClick={() => {
                    playFeedbackSound('click');
                    setSelectedStepIndex(prev => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                  }}
                >
                  Previous Stage
                </button>

                <button
                  disabled={selectedStepIndex === STAGES.length - 1}
                  onClick={() => {
                    playFeedbackSound('click');
                    setSelectedStepIndex(prev => Math.min(STAGES.length - 1, prev + 1));
                  }}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                  }}
                >
                  Next Stage
                </button>
              </div>
            </div>

            {/* Right: Key Milestones Delivered */}
            <div
              className="lg:col-span-5 p-6 rounded-xl border space-y-4"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Stage Deliverables & Verification
              </div>

              <div className="space-y-3">
                {currentStage.milestones.map((ms, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-main)]">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 opacity-70 shrink-0" />
                    <span>{ms}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
