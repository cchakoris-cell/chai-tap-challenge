import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bubble } from '../types';

interface KettleLiquidProps {
  brewProgress: number;
  expression: 'idle' | 'happy' | 'sad' | 'shocked';
}

export const KettleLiquid: React.FC<KettleLiquidProps> = ({ brewProgress, expression }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Periodically generate rising boiling bubbles inside the kettle
  useEffect(() => {
    // Faster boiling when progress is higher!
    const intervalTime = Math.max(100, 600 - brewProgress * 4);
    
    const interval = setInterval(() => {
      if (brewProgress > 0) {
        const newBubble: Bubble = {
          id: Math.random().toString(),
          x: 25 + Math.random() * 50, // Center region
          y: 70, // Start inside kettle
          size: 4 + Math.random() * 8,
          speed: 1 + Math.random() * 2,
        };
        setBubbles((prev) => [...prev.slice(-20), newBubble]);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [brewProgress]);

  // Update bubble positions
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > 10) // Let them dissipate near spout/rim
      );
    });
    return () => cancelAnimationFrame(handle);
  }, [bubbles]);

  const isBoiling = brewProgress > 60;

  return (
    <div className="absolute bottom-4 right-4 w-40 h-40 z-10 select-none pointer-events-none flex flex-col items-center justify-end">
      {/* Kettle Steam Sparks Particle Loop */}
      <div className="absolute top-0 right-1/4 flex flex-col items-center">
        {/* Steam Emojis or Puffs rising up */}
        <AnimatePresence>
          {brewProgress > 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{
                opacity: [0, 0.7, 0],
                y: [-10, -50],
                scale: [0.6, 1.2, 0.8],
                x: [-5, 5, -5]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 0.1
              }}
              className="text-amber-100 font-bold drop-shadow-md text-xl relative"
            >
              💨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Interactive Boiling Light Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 rounded-b-2xl ${
            expression === 'shocked'
              ? 'bg-red-500/40 animate-ping'
              : isBoiling
              ? 'bg-amber-500/35 scale-110'
              : 'bg-amber-600/10'
          }`}
        />

        {/* Traditional Brass / Clay Kettle SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-2xl transition-all duration-300 ${
            expression === 'shocked' ? 'animate-bounce' : ''
          }`}
        >
          {/* Kettle Cap Handle */}
          <circle cx="50" cy="18" r="4.5" fill="#a05a2c" stroke="#5c2e0b" strokeWidth="1.5" />
          <path d="M 45 22.5 L 55 22.5" stroke="#5c2e0b" strokeWidth="3" />

          {/* Kettle Cap/Lid */}
          <path
            d="M 33 28 C 33 22, 67 22, 67 28 Z"
            fill="#c68a4c"
            stroke="#5c2e0b"
            strokeWidth="1.8"
          />

          {/* Kettle Spout (Outflow path left) */}
          <path
            d="M 28 50 C 15 50, 10 32, 18 28 C 16 33, 18 43, 28 44 Z"
            fill="#b87333"
            stroke="#5c2e0b"
            strokeWidth="1.8"
          />

          {/* Dynamic Steam Spray path from Spout */}
          {brewProgress > 30 && (
            <path
              d="M 10 26 C 2 24, 6 12, 14 14"
              fill="none"
              stroke="#eceff1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              className="animate-pulse"
              opacity="0.8"
            />
          )}

          {/* Kettle Main Brass Body */}
          <path
            d="M 28 35 L 72 35 C 84 35, 88 78, 72 82 L 28 82 C 12 78, 16 35, 28 35 Z"
            fill="#d4af37" // Beautiful Golden-Brass
            stroke="#5c2e0b"
            strokeWidth="2"
            id="kettle-body"
          />

          {/* Kettle Handle Bar on right/top */}
          <path
            d="M 68 35 C 84 30, 84 65, 76 72"
            fill="none"
            stroke="#5c2e0b"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 68 35 C 84 30, 84 65, 76 72"
            fill="none"
            stroke="#b87333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Liquid Mask - Inside body */}
          <clipPath id="kettleClip">
            <path d="M 22 38 L 78 38 C 84 38, 84 76, 72 79 L 28 79 C 16 76, 16 38, 22 38 Z" />
          </clipPath>

          {/* Animated Boiling Brown Tea Liquid level */}
          <g clipPath="url(#kettleClip)">
            <rect
              x="5"
              y={80 - brewProgress * 0.42} // Liquid moves upwards as progress grows!
              width="90"
              height="80"
              fill="#5d4037" // Rich Chai Brown
              className="transition-all duration-300"
            />

            {/* Micro Creamy White Foam Cap Layer */}
            {brewProgress > 10 && (
              <rect
                x="5"
                y={78 - brewProgress * 0.42}
                width="90"
                height="3.5"
                fill="#d7ccc8" // Milk Foam
                className="transition-all duration-300 opacity-90"
              />
            )}

            {/* Rising procedural bubbles inside the liquid range */}
            {bubbles.map((b) => (
              <circle
                key={b.id}
                cx={b.x}
                cy={b.y}
                r={b.size / 2.5}
                fill="#d7ccc8"
                opacity={0.6}
              />
            ))}
          </g>

          {/* Shading/Highlights */}
          <path
            d="M 32 38 L 32 78"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.25"
            strokeLinecap="round"
          />
        </svg>

        {/* Progress label percentage bubble inside kettle physically */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5d4037]/90 text-amber-200 border border-[#8d6e63] rounded-md px-1.5 py-0.5 text-[9px] font-black font-mono shadow-md flex items-center">
          Kettle {brewProgress}%
        </div>
      </div>
    </div>
  );
};
