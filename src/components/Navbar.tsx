import React, { useState, useEffect } from 'react';
import { useMotion } from '../context/MotionContext';
import { Sliders, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { StudioLogo } from './StudioLogo';

export const Navbar: React.FC = () => {
  const { settings, effectiveTheme, updateSetting, setIsSettingsOpen, playFeedbackSound } = useMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 40);

      // Section tracking
      const sections = ['home', 'services', 'portfolio', 'about', 'process', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    playFeedbackSound('click');
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const navHeight = 72;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPos,
        behavior: settings.reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const toggleTheme = () => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', nextTheme);
    playFeedbackSound('toggle');
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] transition-all pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: 'var(--accent-focal)',
          opacity: isScrolled ? 1 : 0,
        }}
      />

      {/* Main Top Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md border-b'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(var(--bg-canvas), 0.85)' : 'transparent',
          borderColor: isScrolled ? 'var(--border-subtle)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark with precision DF monogram */}
          <a
            href="#home"
            onClick={e => handleNavClick(e, '#home')}
            onMouseEnter={() => playFeedbackSound('hover')}
            className="text-lg md:text-xl font-bold tracking-tight uppercase whitespace-nowrap shrink-0 group flex items-center gap-2.5"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
          >
            <StudioLogo size={28} />
            <span>DESIGN FOUNDRY</span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  onMouseEnter={() => playFeedbackSound('hover')}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                    isActive ? 'font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] transition-all"
                      style={{ backgroundColor: 'var(--accent-focal)' }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + theme & settings controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg border transition-colors hover:border-white/30 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Motion Settings Panel Trigger */}
            <button
              onClick={() => {
                playFeedbackSound('click');
                setIsSettingsOpen(true);
              }}
              aria-label="Open Motion & Visual Settings"
              className="p-2 rounded-lg border transition-colors hover:border-white/30 cursor-pointer relative"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <a
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              onMouseEnter={() => playFeedbackSound('hover')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: 'var(--accent-focal)',
                color: 'var(--accent-inverted)',
              }}
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="md:hidden p-2 rounded-lg border transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-b px-6 py-6 space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  className="text-base font-medium py-1.5 transition-colors"
                  style={{
                    color: activeSection === link.id ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <a
                href="#contact"
                onClick={e => handleNavClick(e, '#contact')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider rounded-md"
                style={{
                  backgroundColor: 'var(--accent-focal)',
                  color: 'var(--accent-inverted)',
                }}
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
