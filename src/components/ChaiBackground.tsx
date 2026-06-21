import React from 'react';
import { motion } from 'motion/react';

interface ChaiBackgroundProps {
  theme: 'morning' | 'rainy' | 'midnight';
}

export const ChaiBackground: React.FC<ChaiBackgroundProps> = ({ theme }) => {
  // Styles depending on selected theme
  const getThemeConfig = () => {
    switch (theme) {
      case 'rainy':
        return {
          wrapperClass: 'bg-[#1a2536]',
          radialBg: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
          boardBorder: 'border-[#475569]',
          boardBg: 'bg-[#0f172a]/95 text-sky-200',
          menuTitle: 'MONSOON SPL 🌧️',
          menuItems: [
            { name: '☕ Cutting Plus', price: '12/-' },
            { name: '🧄 Kesar Ginger', price: '20/-' },
            { name: '🟢 Elaichi Extra', price: '18/-' },
            { name: '🍛 Hot Pakora', price: '25/-' },
          ],
          bulbColor: 'bg-sky-400',
          bulbGlow: ['0 0 10px rgba(56, 189, 248, 0.4)', '0 0 25px rgba(56, 189, 248, 0.85)', '0 0 10px rgba(56, 189, 248, 0.4)'],
          truckArtColor: 'text-sky-500/10',
          titleColor: 'text-sky-300/10',
        };
      case 'midnight':
        return {
          wrapperClass: 'bg-[#0a0512]',
          radialBg: 'from-[#2e102f] via-[#0f0414] to-[#04010a]',
          boardBorder: 'border-[#4c1d95]',
          boardBg: 'bg-[#1e112c]/95 text-fuchsia-200',
          menuTitle: 'MIDNIGHT TAP 🌃',
          menuItems: [
            { name: '☕ Night Cutting', price: '15/-' },
            { name: '🧈 Bun Maska', price: '20/-' },
            { name: '🧉 Irani Chai', price: '22/-' },
            { name: '🍩 Sweet Biscuit', price: '8/-' },
          ],
          bulbColor: 'bg-fuchsia-500',
          bulbGlow: ['0 0 12px rgba(244, 63, 94, 0.6)', '0 0 30px rgba(244, 63, 94, 0.95)', '0 0 12px rgba(244, 63, 94, 0.6)'],
          truckArtColor: 'text-fuchsia-500/10',
          titleColor: 'text-rose-400/10',
        };
      case 'morning':
      default:
        return {
          wrapperClass: 'bg-[#160d0b]',
          radialBg: 'from-[#2d1b18] via-[#160d0b] to-[#0c0605]',
          boardBorder: 'border-[#8d6e63]',
          boardBg: 'bg-[#1b221e]/95 text-zinc-300',
          menuTitle: 'TAPREE MENU 🌅',
          menuItems: [
            { name: '☕ Cutting', price: '10/-' },
            { name: '🧄 Adrak VIP', price: '15/-' },
            { name: '🟢 Elaichi', price: '15/-' },
            { name: '🍪 Biscuit', price: 'NO BOIL' },
          ],
          bulbColor: 'bg-amber-400',
          bulbGlow: ['0 0 10px rgba(245, 158, 11, 0.4)', '0 0 25px rgba(245, 158, 11, 0.85)', '0 0 10px rgba(245, 158, 11, 0.4)'],
          truckArtColor: 'text-rose-500/10',
          titleColor: 'text-amber-500/10',
        };
    }
  };

  const config = getThemeConfig();

  return (
    <div className={`absolute inset-0 ${config.wrapperClass} overflow-hidden rounded-3xl pointer-events-none select-none z-0 transition-colors duration-1000`}>
      {/* Tapree Background with theme variables */}
      <div className={`absolute inset-0 bg-radial-gradient ${config.radialBg} opacity-95 transition-all duration-1000`} />

      {/* RAINY DAY - Rain drops overlay drops */}
      {theme === 'rainy' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-70">
          {[...Array(12)].map((_, i) => {
            const leftPos = (i * 9) + 4;
            const delay = Math.random() * 2;
            const duration = 1 + Math.random() * 1.5;
            return (
              <motion.div
                key={`rain-${i}`}
                initial={{ y: -50, opacity: 0.1 }}
                animate={{ y: 550, opacity: [0.1, 0.4, 0.1] }}
                transition={{
                  repeat: Infinity,
                  duration: duration,
                  delay: delay,
                  ease: 'linear',
                }}
                className="absolute w-[1.5px] h-12 bg-sky-300/30 rounded-full"
                style={{ left: `${leftPos}%` }}
              />
            );
          })}
        </div>
      )}

      {/* MIDNIGHT STALL - Glowing cozy stars / fairy dust */}
      {theme === 'midnight' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(10)].map((_, i) => {
            const leftPos = Math.random() * 95;
            const topPos = Math.random() * 85;
            const duration = 2 + Math.random() * 3;
            return (
              <motion.div
                key={`star-${i}`}
                animate={{
                  opacity: [0.1, 0.7, 0.1],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  repeat: Infinity,
                  duration: duration,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/40 blur-[1px]"
                style={{ left: `${leftPos}%`, top: `${topPos}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Chalkboard Menu Panel on the wall */}
      <div className={`absolute top-6 left-6 w-32 md:w-36 h-40 border-4 ${config.boardBorder} ${config.boardBg} rounded-lg shadow-2xl rotate-[-2deg] p-2 text-[10px] md:text-xs font-mono transition-all duration-1000 z-10`}>
        <h4 className="text-center text-amber-500 font-bold border-b border-[#8d6e63]/40 pb-1 uppercase tracking-wider">
          {config.menuTitle}
        </h4>
        <div className="space-y-1.5 mt-2">
          {config.menuItems.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b border-white/5 pb-0.5">
              <span className="truncate mr-0.5">{item.name}</span>
              <span className="text-amber-400 shrink-0 font-bold">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glowing Bulb Hanging Lights */}
      <div className="absolute top-0 right-8 space-x-6 z-10 flex">
        {[24, 32, 16].map((len, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Cord */}
            <div className="w-[2px] bg-zinc-700/80" style={{ height: `${len}px` }} />
            {/* Socket */}
            <div className="w-2 h-2.5 bg-zinc-700 rounded-t-sm" />
            {/* Bulb */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: config.bulbGlow,
              }}
              transition={{
                duration: 1.5 + idx * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`w-4 h-5 ${config.bulbColor} rounded-full flex items-center justify-center relative shadow-lg transition-colors duration-1000`}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60 absolute top-0.5 left-1/2 -translate-x-1/2" />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Background Indian Truck Art Pattern & Typography */}
      <div className={`absolute bottom-40 right-4 opacity-[0.06] pointer-events-none flex flex-col items-center rotate-6 select-none transition-colors duration-1000 ${config.truckArtColor}`}>
        <p className="text-5xl font-black uppercase tracking-widest leading-none">बुरी नज़र</p>
        <p className="text-3xl font-black uppercase tracking-widest leading-none mt-1">तेरा मुँह काला</p>
      </div>

      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 opacity-[0.03] select-none text-9xl font-black pointer-events-none tracking-tighter transition-colors duration-1000 ${config.titleColor}`}>
        CHAI
      </div>

      {/* Decorative Rising Steam in background */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 h-32 blur-2xl bg-gradient-to-t from-amber-600/10 to-transparent pointer-events-none" />
    </div>
  );
};

