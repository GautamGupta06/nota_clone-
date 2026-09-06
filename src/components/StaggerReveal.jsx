// /**
//  * StaggerReveal.jsx
//  *
//  * Replicates the nota.uprock.pro transition:
//  * 5 white columns rise scroll-synchronously over the dark hero bg.
//  * Left column leads, right column lags → staircase visual.
//  *
//  * Timing (pixel-based, viewport-independent):
//  *  - Total stagger zone: 600px of scroll
//  *  - Each column starts 80px after the previous one
//  *  - Each column completes its rise over 280px of scroll
//  *  - Col 0: scrolled 0→280px    Col 4: scrolled 320→600px
//  */
// import React, { useEffect, useRef } from 'react';

// // How many px of scroll each column uses to fully rise (viewport-independent)
// const COL_DURATION_PX = 280;
// // How many px between each column's start
// const COL_DELAY_PX = 80;
// // Total scroll range for stagger (last col finishes at 4*80 + 280 = 600px)
// const TOTAL_STAGGER = COL_DELAY_PX * 4 + COL_DURATION_PX; // 600px

// export default function StaggerReveal() {
//   const sectionRef = useRef(null);
//   const colRefs = useRef([]);

//   useEffect(() => {
//     const onScroll = () => {
//       const section = sectionRef.current;
//       if (!section) return;

//       const rect = section.getBoundingClientRect();
//       const viewH = window.innerHeight;

//       // How many px we have scrolled past the section's top edge
//       const scrolledPx = -rect.top;

//       colRefs.current.forEach((col, i) => {
//         if (!col) return;
//         const startPx = i * COL_DELAY_PX;
//         const colProgress = Math.max(
//           0,
//           Math.min(1, (scrolledPx - startPx) / COL_DURATION_PX)
//         );
//         // translateY: viewH when fully below (colProgress=0) → 0 when fully up (colProgress=1)
//         col.style.transform = `translateY(${(1 - colProgress) * viewH}px)`;
//       });
//     };

//     window.addEventListener('scroll', onScroll, { passive: true });
//     onScroll(); // set initial positions
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   return (
//     /**
//      * Outer wrapper: 100vh (sticky height) + 600px (stagger animation range).
//      * The sticky inner stays pinned for exactly the 600px stagger window.
//      */
//     <div
//       ref={sectionRef}
//       style={{ height: `calc(100vh + ${TOTAL_STAGGER}px)` }}
//     >
//       {/* Sticky container — dark bg matching hero so columns "paint over" it */}
//       <div
//         style={{
//           position: 'sticky',
//           top: 0,
//           height: '100vh',
//           overflow: 'hidden',
//           background:
//             'radial-gradient(ellipse 120% 80% at 50% 40%, #2e3346 0%, #1a1e2c 45%, #0f1118 100%)',
//         }}
//       >
//         {/* 5 white columns in a full-screen flex row */}
//         <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
//           {[0, 1, 2, 3, 4].map(i => (
//             <div
//               key={i}
//               ref={el => (colRefs.current[i] = el)}
//               style={{
//                 flex: 1,
//                 height: '100%',
//                 border: "1px solid #0f1118",
//                 background: '#ffffff',
//                 transform: 'translateY(100vh)', // hidden below viewport initially
//                 willChange: 'transform',       // GPU composited for smooth 60fps
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
