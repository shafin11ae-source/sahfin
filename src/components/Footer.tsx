import React from 'react';
import { useMotion } from '../context/MotionContext';
import { ArrowUp, Sliders, Volume2, VolumeX, Play } from 'lucide-react';
import { StudioLogo } from './StudioLogo';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const { settings, updateSetting, setIsSettingsOpen, playFeedbackSound } = useMotion();

  const scrollToTop = () => {
    playFeedbackSound('click');
    window.scrollTo({
      top: 0,
      behavior: settings.reducedMotion ? 'auto' : 'smooth',
    });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <footer className="border-t py-16 relative" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}>
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-3 max-w-sm">
              <div className="flex items-center gap-2.5">
                <StudioLogo size={28} />
                <span
                  className="text-xl font-bold tracking-tight uppercase"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                >
                  DESIGN FOUNDRY
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Independent creative studio crafting bold identities, striking visuals, and meaningful digital experiences.
              </p>
              <div className="pt-1 space-y-1 text-xs font-mono">
                <a
                  href="tel:+918891758194"
                  className="block text-emerald-400 hover:underline"
                >
                  PH: +91 88917 58194 (Shafin)
                </a>
                <a
                  href="mailto:shafinpkadampuzha@gmail.com"
                  className="block text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  shafinpkadampuzha@gmail.com
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    playFeedbackSound('click');
                    const target = document.querySelector(link.href);
                    if (target) {
                      const top = target.getBoundingClientRect().top + window.scrollY - 70;
                      window.scrollTo({ top, behavior: settings.reducedMotion ? 'auto' : 'smooth' });
                    }
                  }}
                  className="transition-colors hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Replay Intro button */}
              {onReplayIntro && (
                <button
                  onClick={() => {
                    playFeedbackSound('click');
                    onReplayIntro();
                  }}
                  className="p-2 rounded-lg border hover:border-white/30 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                  }}
                  title="Replay Loading Intro"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Intro</span>
                </button>
              )}

              {/* Sound toggle */}
              <button
                onClick={() => {
                  const nextVal = !settings.soundEnabled;
                  updateSetting('soundEnabled', nextVal);
                  playFeedbackSound('toggle');
                }}
                className="p-2 rounded-lg border hover:border-white/30 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
                aria-label={settings.soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              >
                {settings.soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Audio On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 opacity-60" />
                    <span className="hidden sm:inline">Audio Off</span>
                  </>
                )}
              </button>

              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg border hover:border-white/30 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
                aria-label="Back to Top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Top</span>
              </button>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-[var(--text-muted)] uppercase tracking-wider">Social Archives:</span>
            <a
              href="https://behance.net/desifoundry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-main)] hover:text-emerald-400 transition-colors"
            >
              Behance (desifoundry)
            </a>
            <span className="text-neutral-700" aria-hidden="true">/</span>
            <a
              href="https://instagram.com/shafineyyy.x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-main)] hover:text-emerald-400 transition-colors"
            >
              Instagram (@shafineyyy.x)
            </a>
            <span className="text-neutral-700" aria-hidden="true">/</span>
            <a
              href="https://linkedin.com/in/shafinpkadampuzha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-main)] hover:text-emerald-400 transition-colors"
            >
              LinkedIn (shafinpkadampuzha)
            </a>
          </div>

          <div
            className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              © {new Date().getFullYear()} DESIGN FOUNDRY. All rights reserved.
            </div>
            <div>
              Forged with Swiss discipline & architectural precision.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Settings Button in bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            playFeedbackSound('click');
            setIsSettingsOpen(true);
          }}
          className="p-3 rounded-full border shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 group backdrop-blur-md"
          style={{
            borderColor: 'var(--border-hover)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-main)',
          }}
          aria-label="Personalized Motion & Visual Settings"
        >
          <Sliders className="w-4 h-4 transition-transform group-hover:rotate-45" />
          <span className="text-xs font-mono uppercase tracking-wider pr-1 hidden sm:inline">
            Motion Settings
          </span>
        </button>
      </div>
    </>
  );
};
