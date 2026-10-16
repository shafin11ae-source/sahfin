import React, { useState, useEffect, useRef } from 'react';
import { useMotion } from '../context/MotionContext';
import { ArrowDown, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { InteractiveEmblem3D } from './InteractiveEmblem3D';

export const Hero: React.FC = () => {
  const { settings, playFeedbackSound } = useMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (settings.reducedMotion || settings.disableHoverMovement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.reducedMotion, settings.disableHoverMovement]);

  const pMult = settings.parallaxIntensity === 'off' ? 0 : settings.parallaxIntensity === 'subtle' ? 0.3 : settings.parallaxIntensity === 'strong' ? 1.5 : 0.8;

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    playFeedbackSound('click');
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({
        top,
        behavior: settings.reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] pt-24 pb-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle architectural ambient glow */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-15 transition-transform duration-700 ease-out"
        style={{
          backgroundColor: 'var(--text-muted)',
          transform: `translate3d(${mouseOffset.x * 20 * pMult}px, ${mouseOffset.y * 20 * pMult}px, 0)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full my-auto py-8">
        {/* Split Hero: Left typography & Right visual container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 z-10">
            {/* Studio kicker */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              <span>DESIGN FOUNDRY</span>
              <span aria-hidden="true">·</span>
              <span>EST. 2024</span>
              <span aria-hidden="true">·</span>
              <span>INDEPENDENT ATELIER</span>
            </div>

            {/* Oversized Editorial Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.06]"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', textWrap: 'balance' }}
            >
              We Forge Ideas Into Visual Identity.
            </h1>

            {/* Supporting Prose */}
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              Independent creative studio crafting bold identities, striking visuals, and meaningful digital experiences. We synthesize Swiss typographic discipline with architectural precision and editorial rigor.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#portfolio"
                onClick={e => scrollToSection(e, 'portfolio')}
                onMouseEnter={() => playFeedbackSound('hover')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-sm hover:opacity-95 active:scale-98"
                style={{
                  backgroundColor: 'var(--accent-focal)',
                  color: 'var(--accent-inverted)',
                }}
              >
                <span>Explore Our Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onClick={e => scrollToSection(e, 'contact')}
                onMouseEnter={() => playFeedbackSound('hover')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md border transition-all duration-200 cursor-pointer hover:border-white/40 active:scale-98"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                <span>Start a Project</span>
              </a>
            </div>

            {/* Micro proof line */}
            <div className="flex items-center gap-3 pt-2 text-xs text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-60"></span>
              <span>Available for select brand commissions, international identity systems & bespoke web design</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Emblem with Lighting Controls (lg:col-span-5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] lg:min-h-[500px]">
            <InteractiveEmblem3D />
          </div>
        </div>

        {/* Studio Craftsmanship Standards Strip (Full-width below hero split) */}
        <div
          className="mt-16 pt-8 pb-4 border-t grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div
              className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              0.1mm
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1">
              Vector Precision Grid
            </div>
          </div>

          <div>
            <div
              className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              100%
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1">
              Bespoke Craftsmanship
            </div>
          </div>

          <div>
            <div
              className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              10
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1">
              Core Design Disciplines
            </div>
          </div>

          <div>
            <div
              className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              48
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1">
              Typographic Systems Built
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pt-8">
          <a
            href="#services"
            onClick={e => scrollToSection(e, 'services')}
            aria-label="Scroll to Services"
            className="flex flex-col items-center gap-1.5 text-xs text-[var(--text-muted)] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest">Scroll</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
