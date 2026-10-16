import React, { useState, useEffect } from 'react';
import { useMotion } from '../context/MotionContext';
import { Compass, Sparkles } from 'lucide-react';
import { StudioLogo } from './StudioLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const MILESTONES = [
  'Calibrating Vector Coordinates',
  'Synthesizing Typographic Weights',
  'Forging Precision Architectural Grid',
  'Rendering Atelier Visuals',
  'Design Foundry Ready',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { settings, playFeedbackSound } = useMotion();
  const [progress, setProgress] = useState(0);
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // If reduced motion is active, exit quickly
    if (settings.reducedMotion) {
      setProgress(100);
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    // Progression timer
    const duration = settings.animationSpeed === 'fast' ? 1400 : settings.animationSpeed === 'slow' ? 2600 : 2000;
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, Math.round(prev + step * (0.8 + Math.random() * 0.5)));
        
        // Update milestone copy
        if (next < 25) setMilestoneIndex(0);
        else if (next < 50) setMilestoneIndex(1);
        else if (next < 75) setMilestoneIndex(2);
        else if (next < 98) setMilestoneIndex(3);
        else setMilestoneIndex(4);

        if (next >= 100) {
          clearInterval(timer);
          // Trigger exit animation
          setTimeout(() => {
            setIsExiting(true);
            playFeedbackSound('success');
            setTimeout(() => {
              setIsFinished(true);
              if (onComplete) onComplete();
            }, 750);
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [settings.reducedMotion, settings.animationSpeed]);

  if (isFinished) return null;

  const handleSkip = () => {
    setIsExiting(true);
    playFeedbackSound('click');
    setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      role="status"
      aria-label="Loading DESIGN FOUNDRY"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-12 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] select-none ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      style={{
        backgroundColor: '#070709',
        color: '#f4f4f6',
      }}
    >
      {/* Top Bar inside Preloader */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="uppercase tracking-widest text-neutral-400">DESIGN FOUNDRY ATELIER</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Skip Intro [ESC]
        </button>
      </div>

      {/* Centerpiece: Monogram, Wordmark, Telemetry Counter & Milestone */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-8 text-center sm:text-left">
        <div className="space-y-4">
          <StudioLogo size={56} className="text-white" />

          <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-neutral-500">
            Independent Creative Studio · Identity & Space
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase leading-none"
            style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
          >
            DESIGN FOUNDRY
          </h1>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-3 pt-2">
          <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-white transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 opacity-60 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="tracking-wider">{MILESTONES[milestoneIndex]}</span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono text-white tracking-tight">
              {progress.toString().padStart(2, '0')}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & Standards Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500 border-t border-white/5 pt-6">
        <div className="flex items-center gap-6">
          <span>0.1mm PRECISION</span>
          <span aria-hidden="true">/</span>
          <span>SWISS GRID</span>
          <span aria-hidden="true">/</span>
          <span>SWISS DISCIPLINE & PRECISION</span>
        </div>

        <div className="opacity-60">
          EST. 2024 · ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};
