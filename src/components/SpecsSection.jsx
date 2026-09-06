import React, { useEffect, useRef } from 'react';


const ease = (t) => t * t * (3 - 2 * t);
// Ultra-smooth 5th order smootherstep (zero 1st & 2nd derivatives for liquid-smooth acceleration and deceleration)
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

const ROW_COUNT = 4;
const EXIT_START = 2000;
const EXIT_ROW_DURATION = 650; // Smooth 650px expansion
const EXIT_ROW_DELAY = 90;     // Symmetrical row delay (90px stagger)
// ALL 4 rows reach 100% full-width at: 2000 + 3*90 + 650 = 2920px
const CURTAIN_DONE = EXIT_START + EXIT_ROW_DELAY * (ROW_COUNT - 1) + EXIT_ROW_DURATION; // 2920px

// Phase 1: Pure solid black screen buffer, then statement fades in smoothly (3050px -> 3300px)
const WHO_FADE_START = CURTAIN_DONE + 130; // 3050px
const WHO_FADE_DURATION = 250; // 250px scroll distance for smooth fade-in
const WHO_FADE_DONE = WHO_FADE_START + WHO_FADE_DURATION; // 3300px

// Phase 2: Statement words illuminate gray -> white completely FIRST (3300px -> 3800px)
const WHO_ILLUMINATE_START = WHO_FADE_DONE; // 3300px
const WHO_ILLUMINATE_DURATION = 500; // Crisp 500px illumination
const WHO_ILLUMINATE_DONE = WHO_ILLUMINATE_START + WHO_ILLUMINATE_DURATION; // 3800px (Illumination 100% complete)

// Phase 2.5: Natural 1:1 parallel scroll-up starts at 3800px; 2nd paragraph crosses 45% height at 4050px
const WHO_SCROLL_UP_START = WHO_ILLUMINATE_DONE; // 3800px
const WHO_PERSONAS_START = WHO_SCROLL_UP_START + 250; // 4050px (Trigger point: 2nd paragraph crosses 45% screen height)

// Phase 3: Personas slide in from right one-by-one with 40% overlap (4050px -> 4482px)
const CARD_DUR = 240;
const STAGGER = 0.40 * CARD_DUR; // 96px (starts when previous card reaches 40% visibility)
const WHO_PERSONAS_DURATION = CARD_DUR + 2 * STAGGER; // 240 + 192 = 432px
const WHO_PERSONAS_DONE = WHO_PERSONAS_START + WHO_PERSONAS_DURATION; // ~4482px

// Phase 4: Pen Growth, Hold, then slide Down + Fade
const PEN_GROW_START = WHO_PERSONAS_DONE + 50;                  // ~4532px
const PEN_GROW_DURATION = 700;
const PEN_GROW_DONE = PEN_GROW_START + PEN_GROW_DURATION;      // ~5232px
const PEN_HOLD_DURATION = 350;                                      // hold at full-screen
const PEN_RECEDE_START = PEN_GROW_DONE + PEN_HOLD_DURATION;       // ~5582px
const PEN_RECEDE_DURATION = 600;                                    // slide down + fade
const PEN_RECEDE_DONE = PEN_RECEDE_START + PEN_RECEDE_DURATION;  // ~6182px

// WorksWithOverlay (Phases 5-14) is a global fixed overlay — constants in WorksWithOverlay.jsx must match
const EXTRA_SCROLL = PEN_RECEDE_DONE + 8800; // keep section pinned while overlay + circle zoom finish (~14982px)

const STATEMENT = "Some thoughts need time, space, and a physical trace to exist. Writing by hand creates focus, presence, and a deeper connection with ideas. This tool is built around that simple truth.";
const WORDS = STATEMENT.split(' ');

const PERSONAS = [
  {
    title: "Students & Learners",
    desc: "Handwritten notes stay personal and intuitive, but become searchable, organized, and easy to study. Lectures, ideas, and revisions are captured as they are — then supported by AI summaries, text recognition, and quick navigation when it matters most.",
    titleWidth: "max-w-[420px] md:max-w-[28vw]",
    descWidth: "max-w-[380px] md:max-w-[25vw]",
  },
  {
    title: "Creators, Designers & Architects",
    desc: "Sketches, diagrams, concepts, and fragments of ideas belong on paper. This tool makes sure they don’t disappear. Everything drawn or written is safely stored, easy to revisit, and ready to evolve into something bigger — without interrupting the creative flow.",
    titleWidth: "max-w-[390px] md:max-w-[26vw]",
    descWidth: "max-w-[350px] md:max-w-[23vw]",
  },
  {
    title: "Managers & Product Thinkers",
    desc: "Meetings start on paper and end with structure. Notes turn into clear summaries, tasks, and follow-ups. The pen captures everything quietly, while the app helps organize decisions without pulling attention away from the room.",
    titleWidth: "max-w-[350px] md:max-w-[23vw]",
    descWidth: "max-w-[310px] md:max-w-[20vw]",
  }
];

const SPECS_DATA = [
  {
    title: "Writing System",
    items: [
      "Fountain pen nib",
      "Natural ink flow",
      "Replaceable fountain-pen ink cartridge",
      "Designed for precise, expressive handwriting"
    ]
  },
  {
    title: "Capture Technology",
    items: [
      "High-precision optical tracking",
      "Real-time stroke capture",
      "Line-by-line accuracy",
      "Supports handwriting, diagrams, sketches"
    ]
  },
  {
    title: "Digital Continuity",
    items: [
      "Notes sync automatically",
      "Searchable over time",
      "Structured with ai support",
      "Ready when you return"
    ]
  }
];

export default function SpecsSection() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const stickyViewportRef = useRef(null);
  const titleRef = useRef(null);
  const penWrapRef = useRef(null);
  const cardRefs = useRef([]);
  const rowRefs = useRef([]);
  const whoWrapRef = useRef(null);
  const whoContentRef = useRef(null);
  const headlineRef = useRef(null);
  const wordRefs = useRef([]);
  const dividerRef = useRef(null);
  const labelRef = useRef(null);
  const leadRef = useRef(null);
  const personaItemRefs = useRef([]);
  const penCardWrapRef = useRef(null);
  const penCardInnerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top; // px scrolled into this section

      // ── STEP 1 (0 → 320px): Title fades in, Pen rises, Cards peek at 42vh with stagger ──
      const t1Raw = Math.max(0, Math.min(1, scrolled / 280));
      const t1 = ease(t1Raw);

      // ── STEP 2 (320 → 620px): Cards HOLD at 42vh peek while Title & Pen reach top resting position ──
      const t2Raw = Math.max(0, Math.min(1, (scrolled - 280) / 340));
      const t2 = ease(t2Raw);

      // 1. TITLE: Fades in (0 → 120px), glides up in Step 1 & 2
      if (titleRef.current) {
        if (scrolled >= CURTAIN_DONE) {
          titleRef.current.style.opacity = '0';
          titleRef.current.style.visibility = 'hidden';
        } else {
          const titleFade = Math.max(0, Math.min(1, scrolled / 120));
          const totalTitleShift = t1 * 10 + t2 * 14;
          titleRef.current.style.visibility = 'visible';
          titleRef.current.style.opacity = titleFade;
          titleRef.current.style.transform = `translate3d(-50%, calc(-50% - ${totalTitleShift}vh), 0)`;
        }
      }

      // 2. PEN IMAGE: Rises to 30vh in Step 1, then reaches 0vh in Step 2
      if (penWrapRef.current) {
        if (scrolled >= CURTAIN_DONE) {
          penWrapRef.current.style.opacity = '0';
          penWrapRef.current.style.visibility = 'hidden';
        } else {
          penWrapRef.current.style.visibility = 'visible';
          penWrapRef.current.style.opacity = '1';
          const penY = (1 - t1) * 45 + (1 - t2) * 30;
          penWrapRef.current.style.transform = `translate3d(0, ${penY}vh, 0)`;
        }
      }

      // 3. 3 GLASS CARDS: Staggered Peek in Step 1, HOLD in Step 2, Staggered Rise in Step 3 (1 -> 2 -> 3)
      const RISE_START = 620;
      const RISE_DUR = 320;
      const RISE_STAGGER = 0.40 * RISE_DUR; // 128px (starts when previous card reaches 40% rise)

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        if (scrolled >= CURTAIN_DONE) {
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          return;
        }
        card.style.visibility = 'visible';
        card.style.opacity = '1';

        let cardY = 42;
        if (scrolled < 320) {
          // Staggered peek-in from bottom
          const peekRaw = Math.max(0, Math.min(1, (scrolled - idx * 40) / 240));
          const peekT = ease(peekRaw);
          cardY = (1 - peekT) * 45 + 42;
        } else if (scrolled < RISE_START) {
          // Hold at peek position
          cardY = 42;
        } else {
          // Staggered rise to full resting position (-2vh) with 40% overlap
          const riseRaw = Math.max(0, Math.min(1, (scrolled - RISE_START - idx * RISE_STAGGER) / RISE_DUR));
          const riseT = smootherstep(riseRaw);
          cardY = 42 - riseT * 44;
        }

        card.style.transform = `translateY(${cardY}vh)`;
      });

      // ── 4. HORIZONTAL BLACK ROWS: Symmetrically expand from center outward ──
      const exitScrolled = scrolled - EXIT_START;

      for (let i = 0; i < ROW_COUNT; i++) {
        const rowEl = rowRefs.current[i];
        if (!rowEl) continue;
        if (scrolled >= 12882) {
          rowEl.style.transform = 'scaleX(0)';
          rowEl.style.opacity = '0';
        } else {
          const rowDelayIndex = (ROW_COUNT - 1) - i;
          const rowStart = rowDelayIndex * EXIT_ROW_DELAY;
          const rawProgress = Math.max(0, Math.min(1, (exitScrolled - rowStart) / EXIT_ROW_DURATION));
          const rowProgress = smootherstep(rawProgress);
          rowEl.style.opacity = '1';
          rowEl.style.transform = `scaleX(${rowProgress})`;
        }
      }

      // ── 5. WHO IT'S FOR: Completely Hidden while Curtain is closing, then Smooth Fade-In ──
      if (scrolled < WHO_FADE_START) {
        // Curtain is closing: Keep Who It's For 100% invisible
        if (whoWrapRef.current) {
          whoWrapRef.current.style.opacity = '0';
          whoWrapRef.current.style.visibility = 'hidden';
          whoWrapRef.current.style.pointerEvents = 'none';
        }
        if (whoContentRef.current) {
          whoContentRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        wordRefs.current.forEach((wordEl) => {
          if (wordEl) wordEl.style.opacity = 0.28;
        });
        if (leadRef.current) leadRef.current.style.opacity = 0;
        if (dividerRef.current) dividerRef.current.style.opacity = 0;
        if (labelRef.current) labelRef.current.style.opacity = 0;

      } else if (scrolled >= PEN_RECEDE_DONE) {
        // Pen receded: Who It's For is completely finished
        if (whoWrapRef.current) {
          whoWrapRef.current.style.opacity = '0';
          whoWrapRef.current.style.visibility = 'hidden';
          whoWrapRef.current.style.pointerEvents = 'none';
        }
      } else {
        // Curtain is 100% closed: Smoothly fade in Who It's For container (0 -> 1)
        const fadeRaw = Math.max(0, Math.min(1, (scrolled - WHO_FADE_START) / WHO_FADE_DURATION));
        const containerFade = smootherstep(fadeRaw);

        if (whoWrapRef.current) {
          whoWrapRef.current.style.visibility = 'visible';
          whoWrapRef.current.style.opacity = containerFade;
          whoWrapRef.current.style.pointerEvents = containerFade > 0.5 ? 'auto' : 'none';
        }

        // ── Phase 2: Word-by-Word Illumination (3350px -> 3950px) ──
        if (scrolled >= WHO_ILLUMINATE_START) {
          const whoScrolled = scrolled - WHO_ILLUMINATE_START;
          const lightProgress = Math.max(0, Math.min(1, whoScrolled / WHO_ILLUMINATE_DURATION));

          wordRefs.current.forEach((wordEl, idx) => {
            if (!wordEl) return;
            const wordThreshold = (idx / WORDS.length) * 0.80;
            const wordDuration = 0.20;
            const wordP = Math.max(0, Math.min(1, (lightProgress - wordThreshold) / wordDuration));
            wordEl.style.opacity = 0.28 + wordP * 0.72;
          });

          // Parallel Lead Paragraphs, Divider, & Label Fade In
          const leadP = Math.max(0, Math.min(1, lightProgress * 1.3));
          if (leadRef.current) leadRef.current.style.opacity = leadP;
          if (dividerRef.current) dividerRef.current.style.opacity = leadP;
          if (labelRef.current) labelRef.current.style.opacity = leadP;
        } else {
          wordRefs.current.forEach((wordEl) => {
            if (wordEl) wordEl.style.opacity = 0.28;
          });
          if (leadRef.current) leadRef.current.style.opacity = 0;
          if (dividerRef.current) dividerRef.current.style.opacity = 0;
          if (labelRef.current) labelRef.current.style.opacity = 0;
        }

        // ── Phase 2.5 & 3: Natural 1:1 Screen Scroll-Up — CAPPED at PEN_GROW_DONE ──
        // Once pen card fills the screen we freeze whoContentRef so it doesn't keep drifting up during hold/recession
        let totalShiftY = 0;
        if (scrolled >= WHO_SCROLL_UP_START) {
          const maxShift = PEN_GROW_DONE - WHO_SCROLL_UP_START; // freeze point
          totalShiftY = Math.min(scrolled - WHO_SCROLL_UP_START, maxShift);
        }

        if (whoContentRef.current) {
          whoContentRef.current.style.transform = `translate3d(0, -${totalShiftY}px, 0)`;
        }

        // ── Phase 3: Personas Scroll-Linked Translation (Begins when 2nd paragraph crosses 45% line) ──
        if (scrolled >= WHO_PERSONAS_START) {
          const personasScrolled = scrolled - WHO_PERSONAS_START;

          // Card 0: [0, 240px]
          const raw0 = Math.max(0, Math.min(1, (personasScrolled - 0) / CARD_DUR));
          // Card 1: starts exactly when Card 0 is 40% in [96px, 336px]
          const raw1 = Math.max(0, Math.min(1, (personasScrolled - STAGGER) / CARD_DUR));
          // Card 2: starts exactly when Card 1 is 40% in [192px, 432px]
          const raw2 = Math.max(0, Math.min(1, (personasScrolled - 2 * STAGGER) / CARD_DUR));

          const raws = [raw0, raw1, raw2];

          // Per-Card Responsive Translation (from +45vw -> 0vw with smooth edge fade)
          personaItemRefs.current.forEach((itemEl, idx) => {
            if (!itemEl) return;
            const raw = raws[idx];
            if (raw <= 0) {
              itemEl.style.opacity = '0';
              itemEl.style.visibility = 'hidden';
              itemEl.style.transform = 'translate3d(100vw, 0, 0)';
            } else {
              // Responsive ease-out for immediate visible motion
              const p = 1 - Math.pow(1 - raw, 1.8);
              const translateX = (1 - p) * 45;
              const opacity = Math.min(1, raw * 4); // Fades in smoothly over first 25% of slide
              itemEl.style.visibility = 'visible';
              itemEl.style.opacity = opacity;
              itemEl.style.transform = `translate3d(${translateX}vw, 0, 0)`;
            }
          });

        } else {
          personaItemRefs.current.forEach((itemEl) => {
            if (itemEl) {
              itemEl.style.opacity = '0';
              itemEl.style.visibility = 'hidden';
              itemEl.style.transform = 'translate3d(100vw, 0, 0)';
            }
          });
        }

        // ── Phase 4: Pen Growth → Hold → Slide Down + Fade ──
        if (scrolled < PEN_GROW_START) {
          // Before growth: small compact card on the right
          if (penCardWrapRef.current) {
            penCardWrapRef.current.style.transformOrigin = 'right center';
            penCardWrapRef.current.style.transform = 'scale3d(0.48, 0.48, 1) translate3d(0, 0, 0)';
            penCardWrapRef.current.style.borderRadius = '32px';
            penCardWrapRef.current.style.opacity = '1';
          }
        } else if (scrolled < PEN_GROW_DONE) {
          // Growing: expands from right (scale 0.48 → 1.0)
          const growRaw = Math.max(0, Math.min(1, (scrolled - PEN_GROW_START) / PEN_GROW_DURATION));
          const growP = smootherstep(growRaw);
          if (penCardWrapRef.current) {
            penCardWrapRef.current.style.transformOrigin = 'right center';
            penCardWrapRef.current.style.transform = `scale3d(${0.48 + growP * 0.52}, ${0.48 + growP * 0.52}, 1)`;
            penCardWrapRef.current.style.borderRadius = `${(1 - growP) * 32}px`;
            penCardWrapRef.current.style.opacity = '1';
          }
        } else if (scrolled < PEN_RECEDE_START) {
          // HOLD: fully expanded, perfectly still
          if (penCardWrapRef.current) {
            penCardWrapRef.current.style.transformOrigin = 'center center';
            penCardWrapRef.current.style.transform = 'scale3d(1, 1, 1) translate3d(0, 0%, 0)';
            penCardWrapRef.current.style.borderRadius = '0px';
            penCardWrapRef.current.style.opacity = '1';
          }
        } else if (scrolled < PEN_RECEDE_DONE) {
          // RECEDE: shrinks from CENTER (goes "behind") + fades out — no upward drift
          const recedeRaw = Math.max(0, Math.min(1, (scrolled - PEN_RECEDE_START) / PEN_RECEDE_DURATION));
          const recedeP = smootherstep(recedeRaw);
          const rScale = 1.0 - recedeP * 0.60;   // 1.0 → 0.40
          const rRadius = recedeP * 28;            // 0 → 28px rounded corners
          if (penCardWrapRef.current) {
            penCardWrapRef.current.style.transformOrigin = 'center center'; // pure center shrink — stays put
            penCardWrapRef.current.style.transform = `scale3d(${rScale}, ${rScale}, 1)`;
            penCardWrapRef.current.style.borderRadius = `${rRadius}px`;
            penCardWrapRef.current.style.opacity = `${1 - recedeP}`;
          }
        } else {
          // Fully gone
          if (penCardWrapRef.current) {
            penCardWrapRef.current.style.opacity = '0';
            penCardWrapRef.current.style.transform = 'scale3d(0.45, 0.45, 1)';
          }
          if (whoWrapRef.current) {
            whoWrapRef.current.style.opacity = '0';
            whoWrapRef.current.style.visibility = 'hidden';
          }
        }

      }

      // ── 7. NAVBAR THEME TOGGLE & BACKGROUND ──
      // Background must stay pure white until the black curtains have 100% covered the viewport at CURTAIN_DONE
      if (scrolled >= 12882) {
        // White circle zoom out & Inside the box: keep everything pure white
        container.classList.add('bg-white');
        container.style.background = '#ffffff';
        if (stickyViewportRef.current) stickyViewportRef.current.style.background = '#ffffff';
        if (wrapperRef.current) wrapperRef.current.style.background = '#ffffff';
      } else if (scrolled >= CURTAIN_DONE) {
        container.classList.remove('bg-white');
        container.style.background = '#000000';
        if (stickyViewportRef.current) stickyViewportRef.current.style.background = '#000000';
        if (wrapperRef.current) wrapperRef.current.style.background = '#000000';
      } else {
        container.classList.add('bg-white');
        container.style.background = '#ffffff';
        if (stickyViewportRef.current) stickyViewportRef.current.style.background = '#ffffff';
        if (wrapperRef.current) wrapperRef.current.style.background = '#ffffff';
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
    <div id="specs-and-who" ref={wrapperRef} className="relative bg-white" style={{ background: '#ffffff' }}>
      {/* ── SECTION 1: PINNED SPECS ANIMATION + WHO IT'S FOR SEQUENCE ── */}
      <section
        ref={containerRef}
        id="specs"
        className="bg-white relative"
        style={{
          background: '#ffffff',
          height: `calc(100vh + ${EXTRA_SCROLL}px)`,
        }}
      >
        {/* Sticky pinned viewport */}
        <div
          ref={stickyViewportRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end"
          style={{
            background: '#ffffff',
          }}
        >

          {/* ── HEADLINE: "Nota pen" & "Specifications" ── */}
          <div
            ref={titleRef}
            className="absolute left-1/2 top-1/2 z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-[90vw]"
            style={{
              transform: 'translate3d(-50%, -50%, 0)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <h2
              className="font-serif-title font-normal text-[11vw] md:text-[7.6vw] lg:text-[7.2vw] leading-[0.88] tracking-[-0.04em]"
              style={{ color: '#737373' }}
            >
              Nota pen
            </h2>
            <h2
              className="font-serif-title font-normal text-[11vw] md:text-[7.6vw] lg:text-[7.2vw] leading-[0.88] tracking-[-0.04em] text-black"
            >
              Specifications
            </h2>
          </div>

          {/* ── CENTER VERTICAL SMART PEN IMAGE ── */}
          <div
            ref={penWrapRef}
            className="absolute inset-0 flex justify-center items-end pointer-events-none"
            style={{
              zIndex: 5,
              opacity: 1,
              transform: 'translateY(100vh)',
              willChange: 'transform',
            }}
          >
            <img
              src="/assets/images/library_image-14700-symbol-iw3g92519-nota_scene_2_img.png"
              alt="Black smart pen"
              style={{
                height: '71.12vh',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '-8vh',
              }}
            />
          </div>

          {/* ── BOTTOM 3 GLASS SPECIFICATION CARDS ── */}
          <div
            className="relative z-10 w-full px-[2vw] md:px-[3.63vw] pb-[6vh] md:pb-[7.5vh]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1vw] max-w-[1720px] mx-auto items-stretch">
              {SPECS_DATA.map((spec, i) => (
                <div
                  key={i}
                  ref={el => cardRefs.current[i] = el}
                  className="flex flex-col gap-[4px]"
                  style={{
                    opacity: 0,
                    transform: 'translateY(80vh)',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Top Card Title Pill (Frosted Glass) */}
                  <div
                    style={{
                      padding: '2.6vh 2.2vw',
                      borderRadius: '18px',
                      background: 'rgba(242, 242, 242, 0.72)',
                      backdropFilter: 'blur(35px)',
                      WebkitBackdropFilter: 'blur(35px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <h3
                      className="font-medium text-black tracking-[-0.05em] leading-none"
                      style={{ fontSize: 'clamp(1.35rem, 1.85vw, 2.15rem)' }}
                    >
                      {spec.title}
                    </h3>
                  </div>

                  {/* Bottom Card Info Pill (Frosted Glass + item rows) */}
                  <div
                    className="flex flex-col flex-1 justify-between"
                    style={{
                      padding: '2.8vh 2.2vw',
                      borderRadius: '18px',
                      background: 'rgba(242, 242, 242, 0.72)',
                      backdropFilter: 'blur(35px)',
                      WebkitBackdropFilter: 'blur(35px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                      rowGap: '1.4vh',
                    }}
                  >
                    {spec.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex justify-between items-center"
                        style={{
                          paddingTop: '0.3vh',
                          paddingBottom: j < spec.items.length - 1 ? '1.5vh' : '0.2vh',
                          borderBottom: j < spec.items.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                        }}
                      >
                        <span
                          className="font-normal text-black leading-[1.3] tracking-[-0.04em]"
                          style={{ fontSize: 'clamp(1.02rem, 1.25vw, 1.45rem)' }}
                        >
                          {item}
                        </span>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.22)',
                            flexShrink: 0,
                            marginLeft: '0.85rem',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── HORIZONTAL BLACK ROWS (Curtain transition to pure black) ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 30,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: ROW_COUNT }, (_, i) => (
              <div
                key={i}
                ref={el => rowRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: `${(i * 100) / ROW_COUNT}%`,
                  height: `calc(${100 / ROW_COUNT}% + 2px)`,
                  left: 0,
                  width: '100%',
                  background: '#000000',
                  transformOrigin: 'center center',
                  transform: 'scaleX(0)',
                  willChange: 'transform',
                }}
              />
            ))}
          </div>

          {/* ── WHO IT'S FOR: EDITORIAL STATEMENT + LEAD + PERSONAS (PERMANENTLY AT TOP) ── */}
          <div
            ref={whoWrapRef}
            id="who-its-for"
            className="absolute inset-0 z-40 flex flex-col justify-start px-[3.5vw] pt-[12vh] md:pt-[14vh] pb-[4vh] text-white overflow-hidden"
            style={{
              opacity: 0,
              pointerEvents: 'none',
              background: 'transparent',
              willChange: 'opacity',
            }}
          >
            <div
              ref={whoContentRef}
              className="max-w-[1720px] mx-auto w-full flex flex-col will-change-transform"
              style={{
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
              }}
            >

              {/* 1. Top Editorial Headline (Permanent Top Position) */}
              <div
                ref={headlineRef}
                className="max-w-[1550px]"
              >
                <h2 className="font-serif-title text-[7.2vw] md:text-[3.95vw] leading-[1.05] tracking-[-0.035em] font-normal flex flex-wrap gap-x-[0.26em] gap-y-[0.06em]">
                  {WORDS.map((word, i) => (
                    <span
                      key={i}
                      ref={el => wordRefs.current[i] = el}
                      style={{
                        opacity: 0.28,
                        color: '#ffffff',
                        transition: 'opacity 60ms ease-out',
                        display: 'inline-block',
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </h2>
              </div>

              {/* 2. Horizontal Divider Line */}
              <div
                ref={dividerRef}
                className="w-full border-t border-[#1f1f1f] my-4 md:my-5"
                style={{
                  opacity: 0,
                  willChange: 'opacity',
                }}
              />

              {/* 3. Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start w-full">

                {/* Left Column: Monospace Descriptor */}
                <div
                  ref={labelRef}
                  className="lg:col-span-6 xl:col-span-6"
                  style={{
                    opacity: 0,
                    willChange: 'opacity',
                  }}
                >
                  <span className="font-mono text-[11px] md:text-[0.78vw] uppercase tracking-[0.16em] text-[#737373] block">
                    WHO IT'S FOR:
                  </span>
                </div>

                {/* Right Column: Lead Text + Personas */}
                <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col space-y-4 md:space-y-6">

                  {/* Lead Paragraphs */}
                  <div
                    ref={leadRef}
                    className="w-full flex flex-col space-y-4"
                    style={{
                      opacity: 0,
                      willChange: 'opacity',
                    }}
                  >
                    <p
                      className="w-full text-left text-white text-[22px] md:text-[1.7vw] font-normal leading-[1.32] tracking-[-0.025em]"
                      style={{ textIndent: 'clamp(40px, 6vw, 90px)' }}
                    >
                      This tool is made for people who think on paper. It keeps handwriting natural and focused, letting you write the way you always have without distractions or screens getting in the way.
                    </p>
                    <p
                      className="w-full text-left text-white text-[22px] md:text-[1.7vw] font-normal leading-[1.32] tracking-[-0.025em]"
                      style={{ textIndent: 'clamp(65px, 9.8vw, 150px)' }}
                    >
                      Everything you write syncs to the app, where your notes are organized, searchable, and ready to work with AI when you need more clarity or structure.
                    </p>
                  </div>

                  {/* Personas (Right-aligned stepped cascade) */}
                  <div className="flex flex-col gap-6 md:gap-8 pt-4 md:pt-6 w-full">
                    {PERSONAS.map((persona, idx) => (
                      <div
                        key={idx}
                        ref={el => personaItemRefs.current[idx] = el}
                        className="flex flex-col items-end w-full"
                        style={{
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translate3d(100vw, 0, 0)',
                          willChange: 'transform, opacity, visibility',
                        }}
                      >
                        <h3 className={`w-full ${persona.titleWidth} text-left text-xl md:text-[1.55vw] lg:text-[1.7vw] font-medium text-white tracking-[-0.03em] leading-snug mb-1`}>
                          {persona.title}
                        </h3>
                        <p className={`w-full ${persona.descWidth} text-left text-[15px] md:text-[1.08vw] lg:text-[1.16vw] text-white leading-[1.48] font-normal`}>
                          {persona.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* ── DYNAMIC GROWING WHITE PEN SHOWCASE (GPU-Accelerated Smooth Scaling) ── */}
              <div className="w-full flex items-center justify-end mt-0">
                <div
                  ref={penCardWrapRef}
                  className="w-full max-w-[1720px] h-screen bg-white text-black flex items-center justify-center overflow-hidden shadow-2xl origin-right"
                  style={{
                    transform: 'scale3d(0.48, 0.48, 1)',
                    transformOrigin: 'right center',
                    borderRadius: '32px',
                    willChange: 'transform, border-radius, opacity',
                  }}
                >
                  <div
                    ref={penCardInnerRef}
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src="/assets/images/library_image-14700-symbol-iw3g92519-nota_scene_2_img.png"
                      alt="NŌTA Smart Pen Horizontal View"
                      className="w-auto h-[70vw] max-h-[700px] object-contain select-none pointer-events-none"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center center',
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}