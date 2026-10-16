import React, { useEffect, useState, useRef } from 'react';
import { useMotion } from '../context/MotionContext';

export const CustomCursor: React.FC = () => {
  const { settings } = useMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const requestRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentRingPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    }

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(!!clickable);
      }
    };

    const onMouseDown = () => setIsPointerDown(true);
    const onMouseUp = () => setIsPointerDown(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth inertia loop for cursor ring
    const animateRing = () => {
      const speed = settings.animationSpeed === 'fast' ? 0.35 : settings.animationSpeed === 'slow' ? 0.15 : 0.22;
      currentRingPos.current.x += (targetPos.current.x - currentRingPos.current.x) * speed;
      currentRingPos.current.y += (targetPos.current.y - currentRingPos.current.y) * speed;
      setRingPos({ x: currentRingPos.current.x, y: currentRingPos.current.y });
      requestRef.current = requestAnimationFrame(animateRing);
    };

    requestRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible, settings.animationSpeed]);

  if (
    isTouchDevice ||
    settings.cursorEffects === 'disabled' ||
    settings.reducedMotion ||
    !isVisible
  ) {
    return null;
  }

  const isMinimal = settings.cursorEffects === 'minimal';

  return (
    <>
      {/* Center sharp dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isPointerDown ? 0.6 : 1})`,
          width: '5px',
          height: '5px',
          backgroundColor: 'var(--accent-focal)',
        }}
      />

      {/* Trailing inertia ring */}
      {!isMinimal && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-150 ease-out"
          style={{
            transform: `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${isHovered ? 1.7 : isPointerDown ? 0.8 : 1})`,
            width: '32px',
            height: '32px',
            borderColor: isHovered ? 'var(--accent-focal)' : 'var(--border-hover)',
            backgroundColor: isHovered ? 'var(--glow-subtle)' : 'transparent',
            backdropFilter: isHovered ? 'invert(0.1)' : 'none',
          }}
        />
      )}
    </>
  );
};
