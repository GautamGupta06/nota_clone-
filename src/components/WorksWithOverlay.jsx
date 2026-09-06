import React, { useEffect, useRef, useState } from 'react';

// Smooth step timing
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// ─── Scroll thresholds ── keep in sync with SpecsSection.jsx ───────────────
const OVERLAY_RISE_START = 5582;
const OVERLAY_RISE_DONE = 6182;
const TEXT_FADE_START = 6182;
const TEXT_FADE_DONE = 6682;
const CURTAIN_EXIT_START = 6682;
const CURTAIN_EXIT_DONE = 7482; // staggered columns fall

// Each slide: 1200px total (600px crossfade, 600px hold)
const SLIDE_DUR = 1200;
const SLIDE_1_START = 7482;
const SLIDE_2_START = SLIDE_1_START + SLIDE_DUR; // 8682
const SLIDE_3_START = SLIDE_2_START + SLIDE_DUR; // 9882
const SLIDE_4_START = SLIDE_3_START + SLIDE_DUR; // 11082
const SLIDES_DONE = SLIDE_4_START + SLIDE_DUR; // 12282

// ─── Phase 12: Slide 4 text & image fade out to black ─────────────────────
const SLIDE_FADEOUT_START = SLIDES_DONE;              // 12282
const SLIDE_FADEOUT_DUR = 600;
const SLIDE_FADEOUT_DONE = SLIDE_FADEOUT_START + SLIDE_FADEOUT_DUR; // 12882

// ─── Phase 13: Black screen & white circle zoom out + "Inside the box" ───
const CIRCLE_ZOOM_START = SLIDE_FADEOUT_DONE;       // 12882
const CIRCLE_ZOOM_DUR = 1400;                     // 1400px scroll for zoom out
const CIRCLE_ZOOM_DONE = CIRCLE_ZOOM_START + CIRCLE_ZOOM_DUR;     // 14282

// ─── Phase 14: Overlay exits (reveals Inside the box section) ─────────────
const OVERLAY_EXIT_START = CIRCLE_ZOOM_DONE;         // 14282
const OVERLAY_EXIT_DONE = OVERLAY_EXIT_START + 700; // 14982

// ─── Slide data ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    heading: ['We use special paper', 'with a nearly invisible', 'pattern'],
    img: '/assets/images/41_block.jpg',
    label: null,
    cardTitle: "For the pen, it's a precise map",
    cardDesc:
      'The pattern defines exact coordinates across the page, allowing the pen to capture every stroke with precision and consistency. For you, it feels like ordinary paper. For the system, it becomes a stable reference that turns handwriting into structured, accurate digital data.',
  },
  {
    heading: ['Looks like paper.', 'Works like a system.'],
    img: '/assets/images/42_block.jpg',
    label: null,
    cardTitle: "For you, it's just a blank sheet",
    cardDesc:
      'You write freely, without grids, guides, or visible markers. The paper feels clean and familiar, keeping your focus on ideas instead of tools. Nothing distracts you from the act of writing. Nothing changes in how you write — only what becomes possible after.',
  },
  {
    heading: ['No delays. No glitches.', 'No random effects.'],
    img: '/assets/images/43_block.jpg',
    label: null,
    cardTitle: 'AI-powered structure',
    cardDesc:
      'Handwriting is processed in real time and enriched quietly in the background. AI recognizes text, structure, and context to organize notes, highlight key ideas, and connect thoughts over time. The technology stays invisible, so your focus remains fully on writing.',
  },
  {
    heading: ['Everything you write is synced', 'to your phone in real time'],
    img: '/assets/images/library_image-14782-symbol-icmdrs40h-nota_scene_7_img_01.jpg',
    label: null,
    cardTitle: 'Your notes. Already there.',
    cardDesc:
      'Every note is instantly transferred to your device and safely stored in your personal space. Access your thoughts anytime, organize them effortlessly, and continue working across devices. Your handwriting becomes part of a system that is searchable, structured, and always available.',
  },
];

const SLIDE_STARTS = [SLIDE_1_START, SLIDE_2_START, SLIDE_3_START, SLIDE_4_START];

export default function WorksWithOverlay() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const colsRef = useRef([]);
  const paperRef = useRef(null);
  const circleRef = useRef(null);
  const insideTitleRef = useRef(null);
  const progressWrapRef = useRef(null);

  // Per-slide refs for direct DOM manipulation (no re-renders in scroll handler)
  const headingRefs = useRef(SLIDES.map(() => React.createRef()));
  const imgRefs = useRef(SLIDES.map(() => React.createRef()));
  const cardRefs = useRef(SLIDES.map(() => React.createRef()));
  const barFillRefs = useRef(SLIDES.map(() => React.createRef()));

  useEffect(() => {
    const specsEl = document.getElementById('specs');

    const handleScroll = () => {
      if (!specsEl || !containerRef.current) return;
      const rect = specsEl.getBoundingClientRect();
      const scrolled = -rect.top;

      // ─── Helper: signal Navbar whether dark overlay is covering viewport ──
      const setOverlayDark = (isDark) => {
        document.body.dataset.overlayDark = isDark ? 'true' : 'false';
      };

      // ─── Phase 5: Container rises up from bottom ──────────────────────────
      if (scrolled < OVERLAY_RISE_START) {
        setOverlayDark(false);
        containerRef.current.style.transform = 'translate3d(0, 100%, 0)';
        if (textRef.current) textRef.current.style.opacity = '0';
        colsRef.current.forEach(c => { if (c) c.style.transform = 'translate3d(0, 0%, 0)'; });
        return;
      }

      if (scrolled < OVERLAY_RISE_DONE) {
        setOverlayDark(true);
        const p = smootherstep((scrolled - OVERLAY_RISE_START) / (OVERLAY_RISE_DONE - OVERLAY_RISE_START));
        containerRef.current.style.transform = `translate3d(0, ${100 - p * 100}%, 0)`;
        if (textRef.current) textRef.current.style.opacity = `${Math.min(1, p * 2)}`;
        colsRef.current.forEach(c => { if (c) c.style.transform = 'translate3d(0, 0%, 0)'; });
        return;
      }

      // ─── Phase 6: Text fades → pure white ────────────────────────────────
      if (scrolled < TEXT_FADE_DONE) {
        setOverlayDark(false); // white curtain columns visible
        containerRef.current.style.transform = 'translate3d(0, 0%, 0)';
        if (textRef.current) {
          const p = smootherstep(Math.max(0, (scrolled - TEXT_FADE_START) / 500));
          textRef.current.style.opacity = `${1 - p}`;
        }
        colsRef.current.forEach(c => { if (c) c.style.transform = 'translate3d(0, 0%, 0)'; });
        return;
      }

      // ─── Phase 7: Staggered columns fall ─────────────────────────────────
      if (scrolled < CURTAIN_EXIT_DONE) {
        setOverlayDark(false); // white columns falling — light bg
        containerRef.current.style.transform = 'translate3d(0, 0%, 0)';
        if (textRef.current) textRef.current.style.opacity = '0';
        const elapsed = scrolled - CURTAIN_EXIT_START;
        const totalDur = CURTAIN_EXIT_DONE - CURTAIN_EXIT_START;
        const stagger = 80;
        const colDur = totalDur - 4 * stagger;
        colsRef.current.forEach((colEl, idx) => {
          if (!colEl) return;
          const p = smootherstep(Math.max(0, Math.min(1, (elapsed - idx * stagger) / colDur)));
          colEl.style.transform = `translate3d(0, ${p * 100}%, 0)`;
        });
        SLIDES.forEach((_, idx) => {
          const heading = headingRefs.current[idx]?.current;
          const card = cardRefs.current[idx]?.current;
          const img = imgRefs.current[idx]?.current;
          if (heading) {
            heading.style.opacity = '0';
            heading.style.visibility = 'hidden';
          }
          if (card) {
            card.style.opacity = '0';
            card.style.visibility = 'hidden';
          }
          if (img) {
            img.style.opacity = '0';
          }
        });
        if (circleRef.current) {
          circleRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
          circleRef.current.style.opacity = '0';
        }
        if (insideTitleRef.current) {
          insideTitleRef.current.style.opacity = '0';
          insideTitleRef.current.style.visibility = 'hidden';
        }
        if (progressWrapRef.current) {
          progressWrapRef.current.style.opacity = '1';
        }
        return;
      }

      // ─── Phases 8–11: Slides 1 to 4 ──────────────────────────────────────
      setOverlayDark(true); // dark slides covering viewport
      containerRef.current.style.transform = 'translate3d(0, 0%, 0)';
      containerRef.current.style.opacity = '1';
      containerRef.current.style.visibility = 'visible';
      if (textRef.current) textRef.current.style.opacity = '0';
      colsRef.current.forEach(c => { if (c) c.style.transform = 'translate3d(0, 100%, 0)'; });

      if (scrolled < SLIDE_FADEOUT_START) {
        if (paperRef.current) {
          paperRef.current.style.transform = 'translate3d(0, 0%, 0)';
        }

        // Determine active slide + progress
        let activeIdx = 0;
        let rawProgress = 0;
        for (let i = SLIDES.length - 1; i >= 0; i--) {
          if (scrolled >= SLIDE_STARTS[i]) {
            activeIdx = i;
            rawProgress = Math.min(1, (scrolled - SLIDE_STARTS[i]) / SLIDE_DUR);
            break;
          }
        }

        // crossfade occupies first 50% of duration, hold is remaining 50%
        const crossfade = Math.min(1, rawProgress * 2);

        // Active text index switches cleanly at midpoint of image crossfade with NO fade animation
        let currentTextIdx = activeIdx;
        if (activeIdx > 0 && crossfade < 0.5) {
          currentTextIdx = activeIdx - 1;
        }

        SLIDES.forEach((_, i) => {
          const heading = headingRefs.current[i].current;
          const img = imgRefs.current[i].current;
          const card = cardRefs.current[i].current;
          const bar = barFillRefs.current[i].current;
          if (!heading || !img || !card || !bar) return;

          let imgOpacity = 0;
          let barWidth = '0%';

          if (i < activeIdx) {
            // Past slides — fully gone
            imgOpacity = 0;
            barWidth = '100%';
          } else if (i === activeIdx) {
            // Active slide — fading IN
            imgOpacity = crossfade;
            barWidth = `${rawProgress * 100}%`;
          } else if (i === activeIdx + 1 && crossfade < 1) {
            // NEXT slide fading out as active fades in
            imgOpacity = 0;
            barWidth = '0%';
          }
          // prev slide fades out
          if (i === activeIdx - 1) {
            imgOpacity = 1 - crossfade;
            barWidth = '100%';
          }

          // Card image retains the smooth crossfade animation
          img.style.opacity = `${imgOpacity}`;

          // Texts have NO fade animation — only the active slide's text is visible
          const isTextActive = (i === currentTextIdx);
          heading.style.opacity = isTextActive ? '1' : '0';
          heading.style.visibility = isTextActive ? 'visible' : 'hidden';
          card.style.opacity = isTextActive ? '1' : '0';
          card.style.visibility = isTextActive ? 'visible' : 'hidden';

          bar.style.width = barWidth;
        });

        // Hide circle and title during slides
        if (progressWrapRef.current) progressWrapRef.current.style.opacity = '1';
        if (circleRef.current) {
          circleRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
          circleRef.current.style.opacity = '0';
        }
        if (insideTitleRef.current) {
          insideTitleRef.current.style.opacity = '0';
          insideTitleRef.current.style.visibility = 'hidden';
        }

        return;
      }

      // ─── Phase 12: Slide 4 Text, Image & Progress Fade Out to Black ───────
      if (scrolled < SLIDE_FADEOUT_DONE) {
        setOverlayDark(true); // still dark — text fading out
        if (paperRef.current) paperRef.current.style.transform = 'translate3d(0, 0%, 0)';

        const fadeProgress = smootherstep((scrolled - SLIDE_FADEOUT_START) / SLIDE_FADEOUT_DUR);
        const fadeOut = Math.max(0, 1 - fadeProgress);

        // Hide slides 0, 1, 2
        for (let i = 0; i < 3; i++) {
          if (headingRefs.current[i]?.current) {
            headingRefs.current[i].current.style.opacity = '0';
            headingRefs.current[i].current.style.visibility = 'hidden';
          }
          if (cardRefs.current[i]?.current) {
            cardRefs.current[i].current.style.opacity = '0';
            cardRefs.current[i].current.style.visibility = 'hidden';
          }
          if (imgRefs.current[i]?.current) {
            imgRefs.current[i].current.style.opacity = '0';
          }
          if (barFillRefs.current[i]?.current) {
            barFillRefs.current[i].current.style.width = '100%';
          }
        }

        // Slide 3 (Slide 4) fades out to black
        const h4 = headingRefs.current[3]?.current;
        const c4 = cardRefs.current[3]?.current;
        const i4 = imgRefs.current[3]?.current;
        const b4 = barFillRefs.current[3]?.current;
        if (h4) {
          h4.style.opacity = `${fadeOut}`;
          h4.style.visibility = fadeOut > 0.01 ? 'visible' : 'hidden';
        }
        if (c4) {
          c4.style.opacity = `${fadeOut}`;
          c4.style.visibility = fadeOut > 0.01 ? 'visible' : 'hidden';
        }
        if (i4) {
          i4.style.opacity = `${fadeOut}`;
        }
        if (b4) {
          b4.style.width = '100%';
        }

        // Fade out progress bars container
        if (progressWrapRef.current) {
          progressWrapRef.current.style.opacity = `${fadeOut}`;
        }

        // Circle stays hidden
        if (circleRef.current) {
          circleRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
          circleRef.current.style.opacity = '0';
        }
        if (insideTitleRef.current) {
          insideTitleRef.current.style.opacity = '0';
          insideTitleRef.current.style.visibility = 'hidden';
        }

        return;
      }

      // ─── Phase 13: Black Screen & White Circle Zoom Out ("Inside the box") ─
      if (scrolled < CIRCLE_ZOOM_DONE) {
        setOverlayDark(true); // black bg until circle fills screen
        if (paperRef.current) paperRef.current.style.transform = 'translate3d(0, 0%, 0)';

        // Ensure all slide elements & progress bars are completely gone
        SLIDES.forEach((_, idx) => {
          if (headingRefs.current[idx]?.current) {
            headingRefs.current[idx].current.style.opacity = '0';
            headingRefs.current[idx].current.style.visibility = 'hidden';
          }
          if (cardRefs.current[idx]?.current) {
            cardRefs.current[idx].current.style.opacity = '0';
            cardRefs.current[idx].current.style.visibility = 'hidden';
          }
          if (imgRefs.current[idx]?.current) {
            imgRefs.current[idx].current.style.opacity = '0';
          }
        });
        if (progressWrapRef.current) {
          progressWrapRef.current.style.opacity = '0';
        }

        const p = (scrolled - CIRCLE_ZOOM_START) / CIRCLE_ZOOM_DUR;

        // White circle scales from center from 0 to 5.5 (filling viewport with white by 85%)
        const circleP = smootherstep(Math.min(1, p / 0.85));
        const scale = circleP * 5.5;

        if (circleRef.current) {
          circleRef.current.style.opacity = p > 0.002 ? '1' : '0';
          circleRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }

        // "Inside the box" text fades in over the expanding white circle
        const titleP = smootherstep(Math.max(0, Math.min(1, (p - 0.35) / 0.50)));
        if (insideTitleRef.current) {
          insideTitleRef.current.style.opacity = `${titleP}`;
          insideTitleRef.current.style.visibility = titleP > 0.01 ? 'visible' : 'hidden';
        }

        return;
      }

      // ─── Phase 14: Seamless dissolve to Inside the Box section ────────────
      if (scrolled < OVERLAY_EXIT_DONE) {
        setOverlayDark(false); // white circle fully covers — light mode
        containerRef.current.style.transform = 'translate3d(0, 0%, 0)';
        containerRef.current.style.visibility = 'visible';
        if (paperRef.current) {
          paperRef.current.style.transform = 'translate3d(0, 0%, 0)';
        }

        // Keep white circle fully expanded (solid white)
        if (circleRef.current) {
          circleRef.current.style.opacity = '1';
          circleRef.current.style.transform = 'translate(-50%, -50%) scale(5.5)';
        }

        const p = smootherstep((scrolled - OVERLAY_EXIT_START) / (OVERLAY_EXIT_DONE - OVERLAY_EXIT_START));

        // As you scroll, title gently drifts up naturally and overlay dissolves into white Inside the Box
        if (insideTitleRef.current) {
          insideTitleRef.current.style.opacity = `${1 - p}`;
          insideTitleRef.current.style.transform = `translate3d(0, -${p * 80}px, 0)`;
          insideTitleRef.current.style.visibility = p > 0.99 ? 'hidden' : 'visible';
        }

        containerRef.current.style.opacity = `${1 - p}`;
        return;
      }

      // Fully handed off to Inside the box section
      setOverlayDark(false);
      containerRef.current.style.opacity = '0';
      containerRef.current.style.visibility = 'hidden';
      containerRef.current.style.transform = 'translate3d(0, 0%, 0)';
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
      className="fixed inset-0 w-full h-full z-[60] pointer-events-none overflow-hidden"
      style={{ transform: 'translate3d(0, 100%, 0)', willChange: 'transform' }}
    >
      {/* ══ Layer 1: "Special Paper" carousel ══════════════════════════ */}
      <div
        ref={paperRef}
        className="absolute inset-0 bg-transparent text-white overflow-hidden"
      >
        {SLIDES.map((slide, i) => (
          <React.Fragment key={i}>
            {/* Heading — top-left, large serif */}
            <div
              ref={headingRefs.current[i]}
              className="absolute top-14 left-8 md:top-20 md:left-14 lg:left-20 z-10 max-w-[55%]"
              style={{ opacity: 0, willChange: 'opacity' }}
            >
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: 'clamp(2rem, 5vw, 5.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: '#ffffff',
                }}
              >
                {slide.heading.map((line, j) => (
                  <span key={j} className="block">{line}</span>
                ))}
              </h2>
            </div>

            {/* Center image */}
            <div
              ref={imgRefs.current[i]}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0, willChange: 'opacity' }}
            >
              <img
                src={slide.img}
                alt={slide.heading[0]}
                style={{
                  maxHeight: '78vh',
                  maxWidth: '70vw',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Info card — bottom-right */}
            <div
              ref={cardRefs.current[i]}
              className="absolute bottom-20 right-8 md:right-14 lg:right-20 z-10"
              style={{
                opacity: 0,
                willChange: 'opacity',
                maxWidth: '380px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '16px',
                padding: '28px 32px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                }}
              >
                {slide.cardTitle}
              </h3>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                {slide.cardDesc}
              </p>
            </div>
          </React.Fragment>
        ))}

        {/* Progress bars — bottom center */}
        <div
          ref={progressWrapRef}
          className="absolute bottom-8 left-0 w-full flex justify-center gap-3 z-20"
          style={{ willChange: 'opacity' }}
        >
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: '48px',
                height: '2px',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                ref={barFillRefs.current[i]}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff',
                  width: '0%',
                  borderRadius: '2px',
                  transition: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* ══ White Circle Zoom Out (Iris Transition to Inside the Box) ══ */}
        <div
          ref={circleRef}
          className="absolute left-1/2 top-1/2 rounded-full bg-white pointer-events-none z-20"
          style={{
            width: 'max(45vw, 45vh)',
            height: 'max(45vw, 45vh)',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* ══ "Inside the box" Title Reveal ══ */}
        <div
          ref={insideTitleRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-30"
          style={{ opacity: 0, visibility: 'hidden', willChange: 'opacity' }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: '#999999',
                display: 'block',
                fontStyle: 'italic',
                marginBottom: '0.12em',
              }}
            >
              Inside
            </span>
            <span
              style={{
                color: '#000000',
                display: 'block',
              }}
            >
              the box
            </span>
          </h2>
        </div>
      </div>

      {/* ══ Layer 2: White curtain columns ══════════════════════════════════ */}
      <div className="absolute inset-0 flex w-full h-full pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => (colsRef.current[i] = el)}
            className="flex-1 h-full bg-white"
            style={{ willChange: 'transform' }}
          />
        ))}
      </div>

      {/* ══ Layer 3: "Works with smart paper" text (fades over white) ═══════ */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 select-none z-30 pointer-events-none"
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        <h2
          style={{
            fontSize: 'clamp(3rem, 9vw, 9rem)',
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: '#000',
          }}
        >
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.35)',
              display: 'block',
              marginBottom: '0.25em',
            }}
          >
            Works with
          </span>
          <span
            style={{
              fontFamily: "'Georgia', serif",
              display: 'block',
            }}
          >
            smart paper
          </span>
        </h2>
      </div>
    </div>
  );
}
