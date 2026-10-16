import React, { useState } from 'react';
import { useMotion } from '../context/MotionContext';
import { Compass, Feather, ShieldCheck, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

export const About: React.FC = () => {
  const { settings, playFeedbackSound } = useMotion();

  // Honest atelier craftsmanship standards
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [metrics, setMetrics] = useState([
    { label: 'Grid Precision Tolerance', value: '0.1mm', note: 'Mathematical vector consistency' },
    { label: 'Bespoke Production', value: '100%', note: 'Zero generative template cloning' },
    { label: 'Active Design Disciplines', value: '10', note: 'Cross-medium craftsmanship' },
    { label: 'Typographic Architectures', value: '48', note: 'Custom pairing systems forged' },
  ]);

  const handleMetricChange = (index: number, field: 'value' | 'label' | 'note', newVal: string) => {
    setMetrics(prev => prev.map((m, i) => (i === index ? { ...m, [field]: newVal } : m)));
  };

  const values = [
    {
      title: 'Architectural Reduction',
      description: 'We subtract the unnecessary until only pure structural signal remains. Clutter distracts; disciplined negative space commands enduring authority.',
      icon: Compass,
    },
    {
      title: 'Typographic Authority',
      description: 'Type is not mere copy; it is the skeleton of communication. We compose bespoke typographic systems engineered with mathematical optical kerning.',
      icon: Feather,
    },
    {
      title: 'Architectural Fluidity',
      description: 'Static design belongs to the previous century. We engineer digital interfaces with natural spatial momentum, tactile balance, and structural elegance.',
      icon: Sparkles,
    },
    {
      title: 'Tactile Longevity',
      description: 'Whether specifying unbleached 600gsm cotton stocks or reactive WebGL shaders, we build visual systems designed to stay relevant for decades, not trend cycles.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="about" className="py-24 border-t relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Core Manifesto Headline */}
        <div className="max-w-4xl space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
            Studio Manifesto · Philosophy
          </div>
          
          <blockquote
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', textWrap: 'balance' }}
          >
            “Good design attracts attention. Great design creates recognition.”
          </blockquote>

          <p className="text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl">
            DESIGN FOUNDRY was founded as a countermeasure against generic algorithmic homogenization. We are an independent creative studio operating at the nexus of Swiss modernist rigor and precision architectural digital interactions.
          </p>
        </div>

        {/* 4 Creative Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border transition-all duration-200 hover:border-white/30 flex flex-col justify-between space-y-6"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="space-y-4">
                  <div
                    className="w-10 h-10 rounded-xl border flex items-center justify-center"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>

                  <h3
                    className="text-lg font-bold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                  >
                    {val.title}
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                    {val.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-[var(--text-muted)] opacity-60">
                  Principle 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Craftsmanship Standards & Editable Metrics */}
        <div
          className="p-8 rounded-2xl border space-y-6"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Craftsmanship Standards & Benchmarks
              </div>
              <div className="text-sm text-[var(--text-main)] font-semibold mt-0.5">
                Measurable studio commitments (editable & verified)
              </div>
            </div>

            <button
              onClick={() => {
                playFeedbackSound('click');
                setIsEditingMetrics(!isEditingMetrics);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg border hover:border-white/40 cursor-pointer self-start sm:self-auto"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-main)',
              }}
            >
              {isEditingMetrics ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5 opacity-70" />
                  <span>Customize Standards</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                {isEditingMetrics ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={m.value}
                      onChange={e => handleMetricChange(idx, 'value', e.target.value)}
                      className="w-full text-2xl font-mono font-bold px-2 py-1 rounded border bg-transparent"
                      style={{ borderColor: 'var(--border-hover)', color: 'var(--text-main)' }}
                    />
                    <input
                      type="text"
                      value={m.label}
                      onChange={e => handleMetricChange(idx, 'label', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1 rounded border bg-transparent"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="text"
                      value={m.note}
                      onChange={e => handleMetricChange(idx, 'note', e.target.value)}
                      className="w-full text-[11px] px-2 py-1 rounded border bg-transparent"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="text-3xl font-extrabold font-mono tabular-nums tracking-tight"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {m.value}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                      {m.label}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {m.note}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
