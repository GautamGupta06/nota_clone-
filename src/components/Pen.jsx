import React, { useEffect, useRef } from 'react';

// Ultra-smooth 5th order smootherstep
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

export default function Pen() {
  const containerRef = useRef(null);
  const penImgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      // Scrolled distance into this section
      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const p = smootherstep(rawProgress);

      // Scale smoothly from 1.0 (initial full view) to 3.2 (covers the screen)
      const scale = 1.0 + p * 2.2;

      if (penImgRef.current) {
        penImgRef.current.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="pen-showcase"
      className="relative w-full bg-white text-black"
      style={{ height: '220vh' }}
    >
      {/* ── STICKY PINNED FULL-VIEWPORT WHITE STAGE ── */}
      <div className="sticky top-0 h-screen w-full bg-white flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[1600px] px-[4vw] flex items-center justify-center">
          <img
            ref={penImgRef}
            src="/assets/images/library_image-14699-symbol-icoj9ef2j-scene2-adaptive480-ezgifcom-png-to-webp-converter.webp"
            alt="NŌTA Smart Pen Horizontal View"
            className="w-full max-w-[1300px] h-auto object-contain select-none pointer-events-none"
            style={{
              transform: 'scale3d(1, 1, 1)',
              transformOrigin: 'center center',
              willChange: 'transform',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
