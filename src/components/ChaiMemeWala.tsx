import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChaiMemeWalaProps {
  expression: 'idle' | 'happy' | 'sad' | 'shocked';
  currentQuote: string;
}

export const ChaiMemeWala: React.FC<ChaiMemeWalaProps> = ({ expression, currentQuote }) => {
  // Select color & details based on expression
  const getAvatarFace = () => {
    switch (expression) {
      case 'happy':
        return {
          emoji: '😎',
          bgColor: 'bg-amber-400 border-amber-300',
          title: 'Dolly Tap-wala'
        };
      case 'shocked':
        return {
          emoji: '🥵',
          bgColor: 'bg-red-500 border-red-300 animate-bounce',
          title: 'Shocked Wala'
        };
      case 'sad':
        return {
          emoji: '😭',
          bgColor: 'bg-zinc-600 border-zinc-500',
          title: 'Moye Moye'
        };
      case 'idle':
      default:
        return {
          emoji: '👨🏽‍🍳',
          bgColor: 'bg-[#b87333] border-amber-600',
          title: 'Kettle Master'
        };
    }
  };

  const avatar = getAvatarFace();

  return (
    <div className="absolute bottom-4 left-4 flex items-end space-x-3 z-10 pointer-events-none select-none max-w-[85%]">
      {/* Animated Caricature Face & Torso */}
      <div className="flex flex-col items-center">
        {/* Dynamic Speech bubble */}
        <AnimatePresence mode="wait">
          {currentQuote && (
            <motion.div
              key={currentQuote}
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mb-3 bg-white text-stone-900 px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-xl text-xs font-bold leading-snug border border-stone-200 relative select-none"
              style={{ maxWidth: '240px' }}
            >
              {currentQuote}
              {/* Bubble Triangle tail */}
              <div className="absolute -bottom-1.5 left-4 w-3.5 h-3.5 bg-white border-r border-b border-stone-200 rotate-45 transform" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {/* Pulsing glow under character */}
          <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-sm" />

          {/* Caricature Outer Avatar */}
          <motion.div
            animate={
              expression === 'shocked'
                ? { rotate: [-10, 10, -10, 10, 0], scale: 1.1 }
                : expression === 'happy'
                ? { y: [0, -8, 0, -8, 0], scale: 1.05 }
                : { y: [0, -2, 0, -2, 0] }
            }
            transition={{
              duration: expression === 'idle' ? 4 : 0.6,
              repeat: expression === 'idle' ? Infinity : 0,
            }}
            className={`w-14 h-14 rounded-full ${avatar.bgColor} border-2 flex items-center justify-center text-3xl shadow-xl relative z-10`}
          >
            {avatar.emoji}

            {/* Tapree Tea Glass Holder Accessory */}
            {expression === 'happy' && (
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -right-3 -top-2 text-xl"
              >
                🕶️
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Small collar / apron tag */}
        <div className="bg-amber-900 border border-amber-700/60 rounded-full px-2 py-0.5 mt-1 text-[9px] text-amber-200 font-bold z-10 tracking-widest uppercase shadow-md pointer-events-none">
          {avatar.title}
        </div>
      </div>
    </div>
  );
};
