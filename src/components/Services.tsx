import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { useMotion } from '../context/MotionContext';
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface ServicesProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForInquiry }) => {
  const { playFeedbackSound } = useMotion();
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_DATA[0].id);

  const activeService = SERVICES_DATA.find(s => s.id === activeServiceId) || SERVICES_DATA[0];

  const handleInquire = (serviceTitle: string) => {
    playFeedbackSound('click');
    onSelectServiceForInquiry(serviceTitle);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 border-t relative" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Core Capabilities · 10 Disciplines
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Services & Visual Disciplines
            </h2>
          </div>
          <p className="text-sm md:text-base max-w-md text-[var(--text-muted)] leading-relaxed">
            Every medium demands bespoke consideration. We engineer comprehensive visual communication from vector marks to physical monographs and spatial digital platforms.
          </p>
        </div>

        {/* Editorial Split Interactive Layout: Left Accordion/List & Right Dynamic Preview Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 10 Service Items */}
          <div className="lg:col-span-7 space-y-2">
            {SERVICES_DATA.map(service => {
              const isSelected = activeServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => {
                    setActiveServiceId(service.id);
                    playFeedbackSound('hover');
                  }}
                  onClick={() => {
                    setActiveServiceId(service.id);
                    playFeedbackSound('click');
                  }}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected ? 'shadow-sm' : 'hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                    borderColor: isSelected ? 'var(--border-hover)' : 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Human editorial index number */}
                      <span
                        className="text-xs font-mono tabular-nums opacity-60"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {service.number}.
                      </span>
                      <h3
                        className="text-base sm:text-lg font-bold tracking-tight"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-xs font-mono text-[var(--text-muted)]">
                        {service.disciplineTag}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? 'rotate-90' : 'opacity-40'
                        }`}
                        style={{ color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>

                  {/* Expanded description on mobile or when active */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t space-y-4" style={{ borderColor: 'var(--border-subtle)' }}>
                      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.deliverableHighlights.map((del, i) => (
                          <div
                            key={i}
                            className="text-xs flex items-center gap-1.5 py-0.5 text-[var(--text-muted)]"
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleInquire(service.title);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--accent-focal)' }}
                        >
                          <span>Inquire About {service.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Interactive Service Preview Stage */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div
              className="p-8 rounded-2xl border relative overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hover)',
              }}
            >
              {/* Subtle background glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-15"
                style={{ backgroundColor: 'var(--text-main)' }}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    Discipline Overview
                  </span>
                  <span className="text-2xl font-mono font-bold tabular-nums" style={{ color: 'var(--text-main)' }}>
                    {activeService.number}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    {activeService.subtitle}
                  </div>
                  <h4
                    className="text-2xl font-bold tracking-tight mb-3"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                  >
                    {activeService.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {activeService.description}
                  </p>
                </div>

                {/* Key Deliverables */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    Standard Deliverables
                  </div>
                  <div className="space-y-2">
                    {activeService.deliverableHighlights.map((del, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-main)]">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 opacity-60 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={() => handleInquire(activeService.title)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:opacity-90 active:scale-98"
                    style={{
                      backgroundColor: 'var(--accent-focal)',
                      color: 'var(--accent-inverted)',
                    }}
                  >
                    <span>Request Proposal for {activeService.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
