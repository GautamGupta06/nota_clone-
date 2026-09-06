import React, { useState, useEffect, useRef } from 'react';
import ScrambleText from './ScrambleText';

const NAV_ITEMS = [
  { label: 'Specifications', href: '#specs' },
  { label: "Who it's for", href: '#who-its-for' },
  { label: 'About', href: '#about' },
  { label: 'Inside the box', href: '#inside-the-box' },
];

const SPEED = 20;

function calculateSequentialNavItems() {
  let accumulatedDelay = 50;
  return NAV_ITEMS.map((item) => {
    const delay = accumulatedDelay;
    const duration = item.label.length * 3 * SPEED + 120;
    accumulatedDelay += duration;
    return { ...item, delay };
  });
}

const SEQUENTIAL_NAV_ITEMS = calculateSequentialNavItems();

function NavLink({ label, href, onClick, delay = 2, isLightBg = false }) {
  return (
    <a href={href} onClick={onClick} className={`nota-nav-link ${isLightBg ? 'light-mode' : ''}`}>
      <ScrambleText text={label} speed={SPEED} delay={delay} />
    </a>
  );
}

export default function Navbar({ onOpenOrder }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isLightBg, setIsLightBg] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navbarY = 40;
      let isOverLight = false;

      // 1. Check if we are inside HeroSection
      const heroEl = document.getElementById('hero-section');
      let isInHero = false;

      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        const totalRange = heroRect.height - window.innerHeight;
        const heroScrolled = -heroRect.top;
        const heroProgress = Math.max(0, Math.min(1, heroScrolled / (totalRange || 1)));
        
        if (heroRect.top <= navbarY && heroRect.bottom >= navbarY) {
          if (heroProgress >= 0.74) {
            isOverLight = true;
          }
        }
        // Active Hero is while hero lottie and initial content is active
        if (heroProgress < 0.95 && heroRect.bottom > window.innerHeight * 0.5) {
          isInHero = true;
        }
      }

      // 2. Check if overlapping SpecsSection (when white) or other light sections
      const specsEl = document.getElementById('specs');
      if (specsEl) {
        const specsRect = specsEl.getBoundingClientRect();
        if (specsRect.top <= navbarY && specsRect.bottom >= navbarY) {
          if (specsEl.classList.contains('bg-white') || specsEl.style.background === 'rgb(255, 255, 255)' || specsEl.style.background === '#ffffff') {
            isOverLight = true;
          }
        }
      }

      const lightSections = document.querySelectorAll('.bg-white');
      lightSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navbarY && rect.bottom >= navbarY) {
          isOverLight = true;
        }
      });

      // If overlay signals dark mode, force dark
      if (document.body.dataset.overlayDark === 'true') {
        isOverLight = false;
      }

      setIsLightBg(isOverLight);

      // 3. Navbar scroll behavior:
      // In Hero Section: Always visible
      // Outside Hero Section: Hide when scrolling down 150px, reveal when scrolling up 150px
      if (isInHero) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
      } else {
        const THRESHOLD = 150;
        const delta = currentScrollY - lastScrollY.current;

        if (delta > THRESHOLD) {
          setVisible(false);
          lastScrollY.current = currentScrollY;
        } else if (delta < -THRESHOLD) {
          setVisible(true);
          lastScrollY.current = currentScrollY;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingTop: '1.51vw',
          paddingLeft: '2.02vw',
          paddingRight: '2.02vw',
        }}>
          {/* LEFT */}
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '3.02vw' }}>
            <a href="#" aria-label="NOTA home">
              <svg style={{ display: 'block', width: '6vw', height: '2vw', minWidth: 70, minHeight: 16, color: isLightBg ? '#000000' : '#ffffff', transition: 'color 300ms ease' }}
                viewBox="0 0 71 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.26969 7.45499H3.91969V24.99H-0.000313967V0.55999H5.63469L12.0397 18.095H12.3897V0.55999H16.3097V24.99H10.6747L4.26969 7.45499ZM20.776 -1.13845e-05H31.206V3.21999H20.776V-1.13845e-05ZM25.991 25.41C24.6143 25.41 23.3777 25.1883 22.281 24.745C21.2077 24.3017 20.286 23.6717 19.516 22.855C18.7693 22.0383 18.186 21.0467 17.766 19.88C17.3693 18.7133 17.171 17.4067 17.171 15.96C17.171 14.5133 17.3693 13.2067 17.766 12.04C18.186 10.8733 18.7693 9.88166 19.516 9.06499C20.286 8.24832 21.2077 7.61832 22.281 7.17499C23.3777 6.73166 24.6143 6.50999 25.991 6.50999C27.3443 6.50999 28.5693 6.73166 29.666 7.17499C30.7627 7.61832 31.6843 8.24832 32.431 9.06499C33.201 9.88166 33.7843 10.8733 34.181 12.04C34.601 13.2067 34.811 14.5133 34.811 15.96C34.811 17.4067 34.601 18.7133 34.181 19.88C33.7843 21.0467 33.201 22.0383 32.431 22.855C31.6843 23.6717 30.7627 24.3017 29.666 24.745C28.5693 25.1883 27.3443 25.41 25.991 25.41ZM25.991 21.98C27.2743 21.98 28.2893 21.595 29.036 20.825C29.7827 20.0317 30.156 18.8767 30.156 17.36V14.56C30.156 13.0433 29.7827 11.9 29.036 11.13C28.2893 10.3367 27.2743 9.93999 25.991 9.93999C24.7077 9.93999 23.6927 10.3367 22.946 11.13C22.1993 11.9 21.826 13.0433 21.826 14.56V17.36C21.826 18.8767 22.1993 20.0317 22.946 20.825C23.6927 21.595 24.7077 21.98 25.991 21.98ZM45.0523 24.99C43.3257 24.99 42.054 24.535 41.2373 23.625C40.4207 22.715 40.0123 21.5367 40.0123 20.09V10.465H34.7623V6.92999H38.3323C39.0557 6.92999 39.569 6.78999 39.8723 6.50999C40.1757 6.20666 40.3273 5.68166 40.3273 4.93499V0.55999H44.4923V6.92999H51.8423V10.465H44.4923V21.455H51.8423V24.99H45.0523ZM68.3137 24.99C67.217 24.99 66.3653 24.7217 65.7587 24.185C65.1753 23.625 64.8253 22.855 64.7087 21.875H64.5337C64.207 22.995 63.5653 23.87 62.6087 24.5C61.652 25.1067 60.4737 25.41 59.0737 25.41C57.2537 25.41 55.807 24.9317 54.7337 23.975C53.6603 23.0183 53.1237 19.985 53.1237 19.985C53.1237 16.345 55.7953 14.525 61.1387 14.525H64.3237V13.335C64.3237 12.1917 64.0437 11.3283 63.4837 10.745C62.9237 10.1617 62.0137 9.86999 60.7537 9.86999C59.6103 9.86999 58.6887 10.0917 57.9887 10.535C57.2887 10.9783 56.6937 11.55 56.2037 12.25L53.6487 10.08C54.2087 9.07666 55.107 8.23666 56.3437 7.55999C57.6037 6.85999 59.2253 6.50999 61.2087 6.50999C63.5887 6.50999 65.4437 7.06999 66.7737 8.18999C68.127 9.28666 68.8037 10.9317 68.8037 13.125V21.63H70.9387V24.99H68.3137ZM60.5787 22.33C61.652 22.33 62.5387 22.085 63.2387 21.595C63.962 21.0817 64.3237 20.3933 64.3237 19.53V17.115H61.2437C58.7937 17.115 57.5687 17.885 57.5687 19.425V20.125C57.5687 20.8483 57.837 21.3967 58.3737 21.77C58.9103 22.1433 59.6453 22.33 60.5787 22.33Z" fill="currentColor" />
              </svg>
            </a>
            <nav style={{ display: 'flex', columnGap: '3.02vw' }} className="nota-desktop-nav">
              {SEQUENTIAL_NAV_ITEMS.map((item) => (
                <NavLink key={item.label} label={item.label} href={item.href} delay={item.delay} isLightBg={isLightBg} />
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Order button */}
            <button
              onClick={onOpenOrder}
              className={`nota-order-outer ${isLightBg ? 'light-mode' : ''}`}
              type="button"
              style={{
                display: 'flex',
                width: '30vw',
                alignItems: 'center',
                padding: '1vw',
                borderRadius: '3px',
                background: isLightBg ? '#000000' : '#ffffff',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                justifyContent: 'space-between',
              }}
            >
              {/* Emblem */}
              <span
                className={`nota-order-emblem ${isLightBg ? 'light-mode' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3.5vw',
                  height: '3.5vw',
                  minWidth: 44,
                  minHeight: 46,
                  color: isLightBg ? '#ffffff' : '#000000',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 38 40" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.0312 1.1884C31.7136 -1.90761 38 1.40597 38 6.97004V33.0299C38 38.594 31.7136 41.9076 27.0312 38.8116L17.5942 32.5713C16.9615 33.4443 16.2103 34.2855 15.3465 35.0654C10.678 39.2805 4.50065 40.114 1.54904 36.927C-1.40256 33.74 -0.0107507 27.7393 4.65782 23.5242C5.5628 22.7071 6.52483 22.0177 7.50871 21.4594C6.54119 20.7959 5.60885 20.0135 4.7394 19.1165C-0.396448 13.818 -1.40163 6.53831 2.49429 2.85682C6.39026 -0.824661 13.7122 0.486304 18.8481 5.78487C19.0157 5.9578 19.1787 6.13298 19.3375 6.30992C19.5007 6.17973 19.6697 6.05598 19.8449 5.94015L27.0312 1.1884ZM20.3604 12.7063C16.0229 12.7063 12.5066 16.1781 12.5066 20.4608C12.5066 24.7436 16.0228 28.2156 20.3604 28.2156C24.698 28.2156 28.2145 24.7436 28.2145 20.4608C28.2144 16.1781 24.698 12.7063 20.3604 12.7063Z" fill="currentColor" />
                </svg>
              </span>
              {/* Inner black box */}
              <span
                className={`nota-order-inner ${isLightBg ? 'light-mode' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  columnGap: '0.6vw',
                  background: isLightBg ? '#ffffff' : '#000000',
                  borderRadius: '3px',
                  height: '3.7vw',
                  padding: '0 1.2vw',
                  minHeight: 46,
                  transition: 'background-color 300ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className={`nota-order-text-primary ${isLightBg ? 'light-mode' : ''}`} style={{ fontFamily: "'Inter',sans-serif", fontSize: '1.2vw', fontWeight: 500, letterSpacing: '-0.04em', color: isLightBg ? '#000' : '#fff', lineHeight: 1 }}>Order</span>
                <span className={`nota-order-text-secondary ${isLightBg ? 'light-mode' : ''}`} style={{ fontFamily: "'Inter',sans-serif", fontSize: '1.2vw', fontWeight: 500, letterSpacing: '-0.04em', color: isLightBg ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>Nota One</span>
                <span className={`nota-order-dot ${isLightBg ? 'light-mode' : ''}`} style={{ width: '0.4vw', height: '0.4vw', minWidth: 4, minHeight: 4, borderRadius: '50%', background: isLightBg ? '#000' : '#fff', flexShrink: 0 }} />
                <span className={`nota-order-text-primary ${isLightBg ? 'light-mode' : ''}`} style={{ fontFamily: "'Inter',sans-serif", fontSize: '1.2vw', fontWeight: 500, letterSpacing: '-0.04em', color: isLightBg ? '#000' : '#fff', lineHeight: 1 }}>$300</span>
              </span>
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              className="nota-burger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: isLightBg ? '#000000' : '#ffffff', transition: 'color 300ms ease', padding: 0 }}
            >
              {mobileOpen
                ? <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><path d="M6 6L26 26M6 26L26 6" stroke={isLightBg ? '#000000' : 'white'} strokeWidth="2.5" strokeLinecap="round" /></svg>
                : <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M18 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-12-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-6-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill={isLightBg ? '#000000' : 'white'} />
                </svg>
              }
            </button>
          </div>
        </div>

      </header>


      {mobileOpen && (
        <div className="nota-mobile-overlay animate-fade-in">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1w' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <div>
            <button className="nota-mobile-cta text-xs" type="button"
              onClick={() => { setMobileOpen(false); onOpenOrder(); }}>
              Order Nota One • $300
            </button>
          </div>
        </div>
      )}
    </>
  );
}
