import React from 'react';
import { motion } from 'motion/react';
import { INGREDIENTS_POOL } from '../data';
import { Sparkles, X } from 'lucide-react';

interface HelpDialogProps {
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ onClose }) => {
  const goodItems = INGREDIENTS_POOL.filter((i) => i.category === 'good');
  const badItems = INGREDIENTS_POOL.filter((i) => i.category === 'bad');

  return (
    <div className="fixed inset-0 bg-[#0c0605]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#2d1b18] border border-[#8d6e63]/40 rounded-3xl w-full max-w-lg p-5 text-white max-h-[85vh] overflow-y-auto shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#5d4037] hover:bg-amber-800 text-amber-200 p-2 rounded-full cursor-pointer transition-all active:scale-95"
          id="btn-close-help"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-3xl">☕🔥</span>
          <h2 className="text-2xl font-black text-amber-400 mt-2 uppercase tracking-wide">
            Chai Tap Challenge
          </h2>
          <p className="text-stone-300 text-xs mt-1">
            Become the ultimate cutting chaiwala of your local tapree!
          </p>
        </div>

        {/* Instructions list */}
        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-stone-200">
          <div className="bg-[#1e100e] border border-[#5d4037] rounded-xl p-3">
            <h3 className="font-bold text-amber-300 mb-1 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" /> Gameplay Rules
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Ingredients will rain from the top. Tap them quickly!</li>
              <li>Only tap actual ingredients that go inside Masala Tea.</li>
              <li>Letting a good ingredient fall past the bottom costs you <span className="text-red-400 font-semibold">1 Life</span>.</li>
              <li>Tapping a bad item instantly costs you <span className="text-red-400 font-semibold">1 Life & points</span>!</li>
              <li>Fill the Kettle to <span className="text-amber-400 font-bold">100%</span> to brew Special Chai and get score multipliers + live refill!</li>
            </ul>
          </div>

          {/* Correct ingredients list */}
          <div>
            <h3 className="font-bold text-emerald-400 mb-2 uppercase tracking-wider text-[11px]">
              🟢 TAP THESE (Masala Chai Ingredients)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {goodItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#142e1d] border border-emerald-900 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-md"
                >
                  <span className="text-2xl mb-1 filter drop-shadow-sm">{item.emoji}</span>
                  <span className="font-bold text-[10px] text-white line-clamp-1">{item.name}</span>
                  <span className="text-[9px] text-emerald-300 font-mono mt-0.5">{item.hindiName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bad ingredients list */}
          <div>
            <h3 className="font-bold text-rose-400 mb-2 uppercase tracking-wider text-[11px]">
              🔴 AVOID THESE (Chai Spoiling Disasters)
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {badItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#331414] border border-rose-900 rounded-xl p-1.5 flex flex-col items-center justify-center text-center shadow-md"
                >
                  <span className="text-2xl mb-1 filter drop-shadow-sm">{item.emoji}</span>
                  <span className="font-bold text-[9px] text-white line-clamp-1">{item.name}</span>
                  <span className="text-[8px] text-red-300 font-mono mt-0.5">{item.hindiName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#1a0f0d] font-black py-3 rounded-2xl tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer text-center text-sm"
            id="btn-play-tapree"
          >
            Chalo, Shuru Karo! 🥁
          </button>
        </div>
      </motion.div>
    </div>
  );
};
