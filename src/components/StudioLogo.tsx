import React from 'react';

interface StudioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showWordmark?: boolean;
  className?: string;
  monogramOnly?: boolean;
}

export const StudioLogo: React.FC<StudioLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
  monogramOnly = false,
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 24
      : size === 'md'
      ? 32
      : size === 'lg'
      ? 48
      : 64;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric DF Monogram SVG */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-label="DESIGN FOUNDRY DF Monogram"
      >
        {/* Outer framing boundary with subtle corner tick marks */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          fill="none"
        />
        
        {/* Architectural Chamfer Corner Accents */}
        <path
          d="M 4 16 L 16 4 M 96 16 L 84 4 M 4 84 L 16 96 M 96 84 L 84 96"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Central Crosshair Grid Lines (Swiss Design System) */}
        <line
          x1="50"
          y1="4"
          x2="50"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <line
          x1="50"
          y1="88"
          x2="50"
          y2="96"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <line
          x1="4"
          y1="50"
          x2="12"
          y2="50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
        <line
          x1="88"
          y1="50"
          x2="96"
          y2="50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Monolithic 'D' Form (Left Architectural Half) */}
        {/* Solid stem and beveled outer curve */}
        <path
          d="M 22 22 L 46 22 C 58 22 66 30 66 42 L 66 58 C 66 70 58 78 46 78 L 22 78 Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="miter"
          fill="none"
        />
        {/* Inner geometric negative space of D */}
        <path
          d="M 33 34 L 44 34 C 50 34 54 38 54 44 L 54 56 C 54 62 50 66 44 66 L 33 66 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2.5"
        />

        {/* Interlocking 'F' Crossbars (Right Architectural Cuts) */}
        {/* Upper horizontal beam */}
        <path
          d="M 46 22 L 78 22 L 78 32 L 54 32"
          fill="currentColor"
        />
        {/* Mid horizontal crossbar */}
        <path
          d="M 46 48 L 74 48 L 74 58 L 54 58"
          fill="currentColor"
        />

        {/* High-precision center origin node */}
        <circle cx="50" cy="50" r="2" fill="var(--accent-focal, #10b981)" />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && !monogramOnly && (
        <div className="flex flex-col text-left leading-none">
          <span
            className="text-base sm:text-lg font-extrabold tracking-tight uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
          >
            DESIGN FOUNDRY
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mt-0.5">
            Atelier · Est. 2024
          </span>
        </div>
      )}
    </div>
  );
};
