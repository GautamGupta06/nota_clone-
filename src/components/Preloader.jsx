import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 500);
          }, 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter text-white font-mono">
          {Math.min(count, 100)} %
        </h1>
        <div className="w-32 h-[1px] bg-white/20 mx-auto mt-4 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${Math.min(count, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
