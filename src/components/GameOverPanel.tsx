import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Copy, Check, Trophy, Share2, Home } from 'lucide-react';

interface GameOverPanelProps {
  score: number;
  highScore: number;
  specialChaiCount: number;
  memeQuote: string;
  gameMode: 'classic' | 'timeattack';
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverPanel: React.FC<GameOverPanelProps> = ({
  score,
  highScore,
  specialChaiCount,
  memeQuote,
  gameMode,
  onRestart,
  onMainMenu,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [cardImage, setCardImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getShareText = () => {
    const modeLabel = gameMode === 'classic' ? 'Classic Tapree Mode' : '10-Second Time Attack';
    return `☕ Chai Tap Challenge Game ☕\n🔥 I scored ${score} in ${modeLabel}! \n🏆 High Score: ${highScore}\n💬 Dil Ki Baat: "${memeQuote}"\n\nShow your tapree skills here: ${window.location.href}`;
  };

  const handleCopyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    const shareText = getShareText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Chai Tap Challenge Performance ☕',
          text: shareText,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err) {
        console.warn("User cancelled or share failed:", err);
      }
    } else {
      // Fallback to copy with feedback
      handleCopyToClipboard();
    }
  };

  const handleShareWhatsApp = () => {
    const textEncoded = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
  };

  // Generate Scorecard using HTML Canvas for Android/WebView download support
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Draw background with tea gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#5d4037'); // Warm cocoa
    gradient.addColorStop(1, '#2d1b18'); // Espresso
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 480, 400);

    // Decorative Borders
    ctx.strokeStyle = '#d4af37'; // Golden
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 480, 400);

    // Minor design frames
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 450, 370);

    // Logo & Header text
    ctx.font = '900 24px sans-serif';
    ctx.fillStyle = '#f59e0b'; // Amber yellow
    ctx.textAlign = 'center';
    ctx.fillText('☕ CHAI TAP CHALLENGE ☕', 240, 50);

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#a1887f';
    ctx.fillText('SUPERSTATION STREET AMUSEMENT CO.', 240, 75);

    // Draw Divider Line
    ctx.strokeStyle = '#5d4037';
    ctx.beginPath();
    ctx.moveTo(40, 90);
    ctx.lineTo(440, 90);
    ctx.stroke();

    // Game Mode Label
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffffff';
    const modeLabel = gameMode === 'classic' ? 'MODE: CLASSIC TAPREE' : 'MODE: 10S TIME ATTACK';
    ctx.fillText(modeLabel, 240, 115);

    // Score layout boxes
    // Draw Current Score
    ctx.fillStyle = '#1e100e';
    ctx.fillRect(50, 140, 170, 80);
    ctx.strokeStyle = '#8d6e63';
    ctx.strokeRect(50, 140, 170, 80);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#a1887f';
    ctx.fillText('FINAL SCORE', 135, 160);

    ctx.font = '900 36px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(score.toString(), 135, 202);

    // Draw High Score
    ctx.fillStyle = '#1e100e';
    ctx.fillRect(260, 140, 170, 80);
    ctx.strokeRect(260, 140, 170, 80);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('🏆 BEST BREW', 345, 160);

    ctx.font = '900 36px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(highScore.toString(), 345, 202);

    // Draw Quote Container Box
    ctx.fillStyle = '#140c0b';
    ctx.fillRect(40, 245, 400, 75);
    ctx.strokeStyle = '#5d4037';
    ctx.strokeRect(40, 245, 400, 75);

    ctx.font = 'bold italic 13px sans-serif';
    ctx.fillStyle = '#ffe0b2';
    // Wrap meme string if too long
    const quote = `"${memeQuote}"`;
    if (quote.length > 50) {
      ctx.fillText(quote.substring(0, 48) + '...', 240, 275);
      ctx.fillText(quote.substring(48), 240, 295);
    } else {
      ctx.fillText(quote, 240, 285);
    }

    // Footnote signature stamp
    ctx.font = '900 11px sans-serif';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('⭐ OFFICIAL DOLLY KETTLE MASTER RATED ⭐', 240, 355);

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#8d6e63';
    ctx.fillText('long tap image to save card to gallery', 240, 372);

    const dataUrl = canvasRef.current.toDataURL('image/png');
    setCardImage(dataUrl);
  }, [score, highScore, memeQuote, gameMode]);

  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-[#0c0605]/95 backdrop-blur-md z-40 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Hidden layout canvas */}
      <canvas ref={canvasRef} width={480} height={400} className="hidden" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-[#2d1b18] border-2 border-amber-600 rounded-3xl w-full max-w-md p-5 text-white text-center shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Confetti & sparkles for high scores */}
        {isNewHighScore && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-25">
            <div className="text-3xl animate-bounce absolute left-4 top-8">✨</div>
            <div className="text-3xl animate-pulse absolute right-6 top-16">🎉</div>
            <div className="text-3xl animate-bounce absolute left-12 bottom-12">🌟</div>
          </div>
        )}

        <div className="mb-2">
          <span className="text-4xl">💥☕💥</span>
        </div>

        <h2 className="text-2xl font-black text-rose-500 uppercase tracking-wider mb-0.5">
          {gameMode === 'classic' ? 'Kettle Broken!' : 'Timer Expired!'}
        </h2>
        <p className="text-xs text-stone-300 font-medium mb-3">
          {gameMode === 'classic' ? 'The heat was too much for the cutting chai pot!' : 'Ten seconds is over! Incredible speed!'}
        </p>

        {/* Meme Quote panel */}
        <div className="bg-[#1b100e] border border-stone-850 rounded-2xl p-3 mb-4 text-amber-100 italic text-xs font-semibold leading-normal shadow-inner relative">
          <span className="text-[10px] uppercase font-bold text-amber-500/70 block mb-0.5 tracking-wider font-sans">Dolly Says:</span>
          "{memeQuote}"
        </div>

        {/* Dynamic Canvas Score Card Preview */}
        {cardImage && (
          <div className="mb-4 bg-[#140c0b] p-1.5 rounded-2xl border border-[#5d4037] shadow-lg relative group">
            <span className="absolute top-2 left-2 bg-[#d4af37] text-stone-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shadow z-10">
              Score Card Image
            </span>
            <img src={cardImage} alt="Chai Score Card" className="w-full h-auto rounded-xl object-contain drop-shadow" />
          </div>
        )}

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#1a0f0d] border border-stone-850 rounded-xl p-2.5">
            <p className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider mb-0.5">Your Score</p>
            <p className="text-2xl font-black font-mono text-white">{score}</p>
          </div>
          <div className="bg-[#1a0f0d] border border-stone-850 rounded-xl p-2.5 flex flex-col items-center justify-center relative">
            {isNewHighScore && (
              <span className="absolute -top-2 bg-amber-500 text-stone-950 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse whitespace-nowrap">
                🏆 NEW BEST!
              </span>
            )}
            <p className="text-[9px] uppercase text-amber-500 font-bold tracking-wider mb-0.5 flex items-center">
              <Trophy className="w-2.5 h-2.5 text-amber-400 mr-1" /> Best Brew
            </p>
            <p className="text-2xl font-black font-mono text-amber-400">{highScore}</p>
          </div>
        </div>

        {gameMode === 'classic' && specialChaiCount > 0 && (
          <div className="mb-4 inline-flex items-center text-[10px] bg-[#1a0f0d] border border-stone-850 px-3 py-1 rounded-full text-amber-200">
            🥇 Special Cutting Pots Brewed: <strong className="ml-1 text-white">{specialChaiCount}</strong>
          </div>
        )}

        {/* Actions Button Panel */}
        <div className="flex flex-col gap-2.5 mt-4 w-full">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#1a0f0d] font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center h-12"
            id="btn-restart-from-gameover"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Play Level Again!
          </button>

          <button
            onClick={handleWebShare}
            className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-350 hover:to-emerald-400 text-[#1a0f0d] font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center h-12"
            id="btn-web-share"
          >
            {shareSuccess ? (
              <>
                <Check className="w-4.5 h-4.5 mr-2 text-stone-900" /> Shared Successfully!
              </>
            ) : (
              <>
                <Share2 className="w-4.5 h-4.5 mr-2 text-stone-900 animate-pulse" /> Share Performance
              </>
            )}
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95 border border-stone-700 select-none h-12"
            id="btn-copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" /> Copy Share Link
              </>
            )}
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-black rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95 select-none h-12"
            id="btn-whatsapp"
          >
            WhatsApp Card
          </button>

          <button
            onClick={onMainMenu}
            className="w-full bg-[#3e2723] hover:bg-[#5d4037] text-amber-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center border border-[#8d6e63]/25 h-12"
            id="btn-main-menu"
          >
            <Home className="w-4 h-4 mr-1.5" /> Return to stall Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
