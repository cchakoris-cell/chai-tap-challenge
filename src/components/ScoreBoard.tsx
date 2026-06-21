import React from 'react';
import { Volume2, VolumeX, Trophy, Pause, Play, HelpCircle, Sparkles, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  lives: number;
  maxLives: number;
  brewProgress: number;
  specialChaiCount: number;
  isPaused: boolean;
  soundEnabled: boolean;
  onTogglePause: () => void;
  onToggleSound: () => void;
  onShowHelp: () => void;
  gameMode: 'classic' | 'timeattack';
  timeLeft: number;
  combo: number;
  isPlaying: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  lives,
  maxLives,
  brewProgress,
  specialChaiCount,
  isPaused,
  soundEnabled,
  onTogglePause,
  onToggleSound,
  onShowHelp,
  gameMode,
  timeLeft,
  combo,
  isPlaying,
}) => {
  return (
    <div className={`w-full bg-[#3e2723]/90 backdrop-blur-md border border-[#8d6e63]/30 rounded-2xl text-white shadow-2xl relative overflow-hidden responsive-board ${isPlaying ? 'p-2 sm:p-4' : 'p-4 md:p-5'}`}>
      {/* Decorative Light Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70" />

      {/* Top Banner Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 text-[#1a0f0d] font-black text-xs px-2 py-1 rounded-md tracking-wider uppercase animate-pulse shadow-md">
            {gameMode === 'classic' ? 'CLASSIC TAPREE' : '10S TIME ATTACK'}
          </div>
          {gameMode === 'classic' && specialChaiCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center text-xs bg-amber-100 text-[#5d4037] font-bold px-2 py-0.5 rounded-full shadow-sm"
              title="Special cutting chai brewed successfully!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1 fill-amber-300" />
              <span>{specialChaiCount} Brewed!</span>
            </motion.div>
          )}
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: [1, 1.3, 1], rotate: [-10, 10, -5] }}
              transition={{ duration: 0.2 }}
              className="bg-rose-500 text-white font-black text-xs px-2.5 py-0.5 rounded-md shadow-lg"
            >
              COMBO x{combo}! 🔥
            </motion.div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 md:space-x-2">
          <button
            onClick={onShowHelp}
            className="w-10 h-10 flex items-center justify-center bg-[#5d4037] hover:bg-[#7b5e57] active:scale-95 text-amber-200 rounded-xl transition-all border border-[#8d6e63]/40 cursor-pointer shadow-sm"
            title="Help & Rules"
            id="btn-help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={onToggleSound}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border cursor-pointer shadow-sm active:scale-95 ${
              soundEnabled
                ? 'bg-[#5d4037] hover:bg-[#7b5e57] text-amber-400 border-[#8d6e63]/45'
                : 'bg-red-950/40 hover:bg-red-950/60 text-red-300 border-red-900/40'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            id="btn-sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={onTogglePause}
            className="w-10 h-10 flex items-center justify-center bg-[#a1887f] hover:bg-[#bcaaa4] text-amber-950 font-bold rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            id="btn-pause"
          >
            {isPaused ? <Play className="w-5 h-5 fill-amber-950" /> : <Pause className="w-5 h-5 fill-amber-950" />}
          </button>
        </div>
      </div>

      {/* Main Stats Display */}
      <div className={`grid grid-cols-3 gap-3 md:gap-4 items-center ${isPlaying ? 'hidden md:grid' : 'grid'}`}>
        {/* Score Card */}
        <div className="bg-[#2d1b18] rounded-xl p-2.5 md:p-3 border border-[#5d4037] text-center shadow-inner">
          <p className="text-[10px] md:text-xs text-amber-200/70 tracking-wider uppercase font-medium">Brew Score</p>
          <motion.p
            key={score}
            initial={{ scale: 1.3, color: '#f59e0b' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.2 }}
            className="text-2xl md:text-3xl font-black font-mono tracking-tight"
          >
            {score}
          </motion.p>
        </div>

        {/* High Score Card */}
        <div className="bg-[#2d1b18] rounded-xl p-2.5 md:p-3 border border-[#5d4037] text-center shadow-inner relative overflow-hidden">
          <div className="absolute -right-1 -top-1 opacity-10">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-[10px] md:text-xs text-amber-200/70 tracking-wider uppercase font-medium flex items-center justify-center">
            <Trophy className="w-3 h-3 text-amber-400 mr-1" /> Best
          </p>
          <p className="text-2xl md:text-3xl font-black font-mono tracking-tight text-amber-400">
            {highScore}
          </p>
        </div>

        {/* Right element: Lives (Classic) or Time Left (Time Attack) */}
        {gameMode === 'classic' ? (
          <div className="flex flex-col items-center bg-[#2d1b18] rounded-xl p-2.5 md:p-3 border border-[#5d4037] shadow-inner">
            <p className="text-[10px] md:text-xs text-amber-200/70 tracking-wider uppercase font-medium mb-1">Kulhad Cups</p>
            <div className="flex items-center space-x-1 justify-center">
              {Array.from({ length: maxLives }).map((_, i) => {
                const active = i < lives;
                return (
                  <motion.div
                    key={i}
                    animate={active ? { scale: [1, 1.15, 1] } : { scale: 0.9, opacity: 0.35 }}
                    transition={active ? { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } : { type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative cursor-default"
                  >
                    <span className="text-xl md:text-2xl" role="img" aria-label="cup">
                      {active ? '☕' : '✨'}
                    </span>
                    {active && (
                      <motion.span
                        animate={{ y: [-2, -8, -2], opacity: [0, 0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-300 pointer-events-none"
                      >
                        ~
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-[#2d1b18] rounded-xl p-2.5 md:p-3 border border-[#5d4037] shadow-inner">
            <p className="text-[10px] md:text-xs text-amber-200/70 tracking-wider uppercase font-medium mb-1">Time Left</p>
            <motion.p
              animate={timeLeft <= 3 ? { scale: [1, 1.25, 1], color: ['#f87171', '#ef4444', '#f87171'] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${timeLeft <= 3 ? 'text-red-500 font-extrabold' : 'text-amber-400'}`}
            >
              {timeLeft.toFixed(1)}s
            </motion.p>
          </div>
        )}
      </div>

      {/* Progress to Special Chai Kettle Brew */}
      <div className={`mt-4 ${isPlaying ? 'hidden md:block' : 'block'}`}>
        {gameMode === 'classic' ? (
          <>
            <div className="flex justify-between items-center text-xs text-amber-200 mb-1">
              <span className="font-bold tracking-wide flex items-center">
                <Coffee className="w-3.5 h-3.5 text-amber-400 mr-1.5 animate-bounce" />
                Special Cutting Chai Pot
              </span>
              <span className="font-mono font-bold">{brewProgress}%</span>
            </div>
            <div className="w-full bg-[#1e0f0c] h-3.5 rounded-full overflow-hidden p-[2px] border border-[#5d4037]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${brewProgress}%` }}
                transition={{ type: 'spring', stiffness: 60 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 shadow-inner flex items-center justify-end pr-1.5"
              >
                {brewProgress >= 80 && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-1.5 rounded-full bg-white shadow-md shadow-white"
                  />
                )}
              </motion.div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center text-xs text-amber-200 py-1 bg-amber-950/30 px-3 rounded-lg border border-amber-900/30">
            <span className="flex items-center font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 mr-1.5 animate-pulse" />
              Time Challenge: Maximize tapping!
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase">NO LIVES DEDUCT</span>
          </div>
        )}
      </div>
    </div>
  );
};
