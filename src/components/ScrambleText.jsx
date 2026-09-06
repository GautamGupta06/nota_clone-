import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export default function ScrambleText({ text, className = '', speed = 25, delay = 0, hover = false }) {
  const [iteration, setIteration] = useState(-1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const elementRef = useRef(null);

  const startScramble = () => {
    let currentIter = 0;
    const maxIterations = text.length * 3;

    setIteration(0);
    const interval = setInterval(() => {
      currentIter += 1;
      setIteration(currentIter);

      if (currentIter >= maxIterations) {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, speed);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setTimeout(startScramble, delay);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, delay]);

  if (isFinished) {
    return (
      <span
        ref={elementRef}
        className={className}
        onMouseEnter={hover ? startScramble : undefined}
      >
        {text}
      </span>
    );
  }

  const currentRevealedIndex = iteration >= 0 ? iteration / 3 : -1;

  return (
    <span
      ref={elementRef}
      className={className}
      onMouseEnter={hover ? startScramble : undefined}
      style={{ display: 'inline-block' }}
    >
      {text.split('').map((char, index) => {
        if (char === ' ') {
          return (
            <span
              key={index}
              style={{
                opacity: iteration >= 0 && index < currentRevealedIndex ? 1 : 0,
                transition: 'opacity 120ms ease-out',
                whiteSpace: 'pre',
              }}
            >
              {' '}
            </span>
          );
        }

        let isRevealed = iteration >= 0 && index < currentRevealedIndex;
        let isScrambling = iteration >= 0 && index >= currentRevealedIndex && index < currentRevealedIndex + 2;
        let opacity = 0;

        if (isRevealed) {
          opacity = 1;
        } else if (isScrambling) {
          opacity = 0.7;
        } else {
          opacity = 0;
        }

        let displayChar = isRevealed
          ? char
          : CHARS[Math.floor((index * 13 + (iteration > 0 ? iteration : 0)) % CHARS.length)];

        return (
          <span
            key={index}
            style={{
              opacity,
              transition: 'opacity 120ms ease-out',
              display: 'inline-block',
              whiteSpace: 'pre',
            }}
          >
            {displayChar}
          </span>
        );
      })}
    </span>
  );
}
