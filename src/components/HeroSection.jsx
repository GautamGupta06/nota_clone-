import React, { useEffect, useRef } from 'react';
import ScrambleText from './ScrambleText';

/**
 * HeroSection
 * 
 * Matches official website https://nota.uprock.pro/
 * - 270vh scroll range where the 100vh viewport stays sticky.
 * - Lottie 3D rotating pen is scroll-synced.
 * - Headline typography: Instrument Serif, 9.68vw (12.5vw on mobile), line-height 100%, letter-spacing -0.04em.
 * - Transition curtains: 6 white columns with 1px right borders (staggered staircase rise covering hero).
 */

const COL_COUNT = 6;

export default function HeroSection({ onOpenOrder }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const colRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalRange = rect.height - viewH;          // 200vh worth of scroll
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (totalRange || 1)));

      // ── Lottie: completes 100% of its animation by 58% scroll ──
      // Pen is fully rotated and completely settled well before curtains start!
      const lottieProgress = Math.max(0, Math.min(1, progress / 0.58));
      if (playerRef.current?.seek) {
        try {
          const totalFrames = playerRef.current.getLottie?.()?.totalFrames || 100;
          playerRef.current.seek(Math.round(lottieProgress * (totalFrames - 1)));
        } catch (_) { }
      }

      // ── 6 White Curtains: start at 72% and finish cleanly right at 99% of scroll ──
      // Col 0: 0.72→0.82 ... Col 5: 0.89→0.99 (zero gap before SpecsSection!)
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        const colStart    = 0.72 + i * 0.034;
        const colDuration = 0.10;
        const colProgress = Math.max(0, Math.min(1, (progress - colStart) / colDuration));
        col.style.transform = `translateY(${(1 - colProgress) * viewH}px)`;
        
        // Borders stay crisp until last column finishes, then softly fade into SpecsSection
        if (i < COL_COUNT - 1) {
          const fadeProgress = Math.max(0, Math.min(1, (progress - 0.95) / 0.04));
          col.style.borderRight = `1px solid rgba(0, 0, 0, ${0.2 * (1 - fadeProgress)})`;
        }
      });
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
    <section
      id="hero-section"
      ref={containerRef}
      className="relative h-[300vh] hero-radial-bg text-white"
    >
      {/* Sticky Viewport Camera */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end p-[2.02vw]">

        {/* Lottie smart-pen 3D animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-full h-full max-w-[1600px] max-h-[1000px] flex items-center justify-center scale-[1.2] md:scale-[1.28]">
            <lottie-player
              ref={playerRef}
              src="/assets/lottie/0_refinedcover_07_04.json"
              background="transparent"
              style={{ width: '100%', height: '100%' }}
            ></lottie-player>
          </div>
        </div>

        {/* Bottom-left headline — authentic Instrument Serif styling matching nota.uprock.pro */}
        <div className="relative z-10 max-w-5xl pb-[1vw] md:pb-[1.5vw]">
          <h1 className="font-serif-title font-normal text-[12.5vw] md:text-[9.68vw] leading-[100%] tracking-[-0.04em] text-white">
            <ScrambleText text="Smart pen" speed={25} />
          </h1>
          <h1 className="font-serif-title font-normal text-[12.5vw] md:text-[9.68vw] leading-[100%] tracking-[-0.04em] text-white pr-[1.01vw]">
            <ScrambleText text="for real thinking" speed={25} delay={150} />
          </h1>
        </div>

        {/* ── 6 white curtains — rise staggered over hero to transition seamlessly to SpecsSection ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            zIndex: 20,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: COL_COUNT }, (_, i) => (
            <div
              key={i}
              ref={el => colRefs.current[i] = el}
              style={{
                flex: 1,
                height: '100%',
                background: '#ffffff',
                borderRight: i < COL_COUNT - 1 ? '1px solid rgba(0, 0, 0, 0.2)' : 'none',
                transform: 'translateY(100vh)',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
