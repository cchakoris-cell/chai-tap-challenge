/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Coffee, RotateCcw, Info, Volume2, VolumeX, Pause, Trophy, HelpCircle, X, ChevronRight } from 'lucide-react';

import { FallingItem, PointLabel, Mission } from './types';
import { INGREDIENTS_POOL, SUCCESS_MEMES, ERROR_MEMES, GAME_OVER_MEMES } from './data';

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'ginger_tap',
    title: 'Adrak Ka Kamaal 🧄',
    description: 'Tap 10 Ginger (Adrak) pieces in a single match.',
    target: 10,
    current: 0,
    rewardPoints: 150,
    completed: false,
    claimed: false,
    type: 'ginger_tap'
  },
  {
    id: 'no_bad_items_game',
    title: 'Hygiene Rating ★★★',
    description: 'Complete 3 matches without tapping any garbage items.',
    target: 3,
    current: 0,
    rewardPoints: 250,
    completed: false,
    claimed: false,
    type: 'no_bad_items_game'
  },
  {
    id: 'royal_brew_master',
    title: 'Double Boiling Kettle ♨️',
    description: 'Brew 2 Special Chai Kettles in Classic mode (by hitting 100%).',
    target: 2,
    current: 0,
    rewardPoints: 300,
    completed: false,
    claimed: false,
    type: 'royal_brew_master'
  }
];

import {
  playSuccessSound,
  playErrorSound,
  playPowerUpSound,
  playGameOverSound,
  playClickSound,
  playTickTockSound,
  playCelebrationSound,
  playThemeAmbientStep,
} from './utils/sound';

import { ScoreBoard } from './components/ScoreBoard';
import { ChaiBackground } from './components/ChaiBackground';
import { ChaiMemeWala } from './components/ChaiMemeWala';
import { KettleLiquid } from './components/KettleLiquid';
import { HelpDialog } from './components/HelpDialog';
import { GameOverPanel } from './components/GameOverPanel';

interface Particle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  life: number; // starts at 1, goes down to 0
  rotation: number;
}

const memeDialogues = [
  "Ae Raju! Dhyan kidhar hai?!",
  "Moye Moye! Chai barbaad!",
  "Gadha hai kya? Biscuit nahi!",
  "Arey bhai! Samosa mat daal!",
  "Kya kar raha hai? Pagal hai?!",
  "Bhai, chai mein doodh daal na!",
  "Haye! Meri chai! 😭",
  "Abe o! Seedha dekh!",
  "Fir se? Tujhse na ho payega!",
  "Chai wala ro raha hai!",
  "Cutting chai barbaad! 😤",
  "Ae vedya! Ye kya kiya!"
];

export default function App() {
  // Splash & Onboarding
  const [showSplash, setShowSplash] = useState(true);

  // Responsive Voice feature states
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_voice_enabled');
      return stored !== 'false'; // default to true
    } catch {
      return true;
    }
  });
  const [voiceSupported, setVoiceSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setVoiceSupported(false);
    }
  }, []);

  // Web Speech synthesis speak helper in Hindi (hi-IN)
  const speakHindi = useCallback((text: string) => {
    if (!voiceSupported) return;
    try {
      const stored = localStorage.getItem('chai_challenge_voice_enabled');
      if (stored === 'false') return;
    } catch {
      if (!voiceEnabled) return;
    }
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel(); // Stop current speech so they don't overlap
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Force hi-IN voice if available in the browser's list
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('hi-IN'));
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis run failed', e);
      }
    }
  }, [voiceEnabled, voiceSupported]);

  const speakRandomMeme = useCallback(() => {
    const randomMeme = memeDialogues[Math.floor(Math.random() * memeDialogues.length)];
    speakHindi(randomMeme);
  }, [speakHindi]);

  const speakMilestone = useCallback((currentScore: number) => {
    if (currentScore === 10) {
      speakHindi("Bahut badhiya! 10 points!");
    } else if (currentScore === 20) {
      speakHindi("Waah! 20 points! Kya baat hai!");
    } else if (currentScore === 30) {
      speakHindi("Kamaal kar diya! 30 points!");
    } else if (currentScore === 40) {
      speakHindi("Superstar! 40 points!");
    } else if (currentScore === 50) {
      speakHindi("Legend! 50 points! Dolly proud!");
    }
  }, [speakHindi]);

  const toggleVoice = () => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      alert("Your browser doesn't support voice. Text will be shown instead.");
      return;
    }
    setVoiceEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('chai_challenge_voice_enabled', next ? 'true' : 'false');
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    triggerSound('click');
  };

  const handleThemeChange = (newTheme: 'morning' | 'rainy' | 'midnight') => {
    setActiveTheme(newTheme);
    try {
      localStorage.setItem('chai_challenge_active_theme', newTheme);
    } catch (e) {
      console.warn(e);
    }
    triggerSound('click');
  };

  const loadVoicePreference = () => {
    try {
      const stored = localStorage.getItem('chai_challenge_voice_enabled');
      return stored !== 'false';
    } catch {
      return true;
    }
  };

  // Core Game State configs
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameMode, setGameMode] = useState<'classic' | 'timeattack'>('classic');
  const [activeTheme, setActiveTheme] = useState<'morning' | 'rainy' | 'midnight'>(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_active_theme');
      if (stored === 'rainy' || stored === 'midnight') return stored as 'morning' | 'rainy' | 'midnight';
    } catch (e) {
      console.warn(e);
    }
    return 'morning';
  });
  const [timeLeft, setTimeLeft] = useState(20.0);
  const [combo, setCombo] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // High Scores Saved separated by mode
  const [highScoreClassic, setHighScoreClassic] = useState(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_high_score_classic') || localStorage.getItem('chai_challenge_high_score');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [highScoreTimeAttack, setHighScoreTimeAttack] = useState(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_high_score_timeattack');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Current stats
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [brewProgress, setBrewProgress] = useState(0);
  const [specialChaiCount, setSpecialChaiCount] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  // Daily Missions states
  const [totalReputation, setTotalReputation] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_total_reputation');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const stored = localStorage.getItem('chai_challenge_daily_missions');
      if (stored) {
        const parsed = JSON.parse(stored) as Mission[];
        if (parsed && parsed.length === INITIAL_MISSIONS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_MISSIONS;
  });

  // Session-level metrics for completion tracking
  const [sessionGingerTapped, setSessionGingerTapped] = useState(0);
  const [sessionBadItemsTapped, setSessionBadItemsTapped] = useState(0);
  const [sessionSpecialBrews, setSessionSpecialBrews] = useState(0);

  // Auto-persist missions
  useEffect(() => {
    try {
      localStorage.setItem('chai_challenge_daily_missions', JSON.stringify(missions));
    } catch (e) {
      console.warn(e);
    }
  }, [missions]);

  // Auto-persist reputation
  useEffect(() => {
    try {
      localStorage.setItem('chai_challenge_total_reputation', totalReputation.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [totalReputation]);


  // Interactive juice particles & UI effects
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [pointLabels, setPointLabels] = useState<PointLabel[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [flashState, setFlashState] = useState<'none' | 'success' | 'error'>('none');
  const [walaExpression, setWalaExpression] = useState<'idle' | 'happy' | 'sad' | 'shocked'>('idle');
  const [walaQuote, setWalaQuote] = useState('Chalo bhaaya, ekdum swadi kadak cutting banaye! ☕');
  const [lastWrongDialogue, setLastWrongDialogue] = useState(() => {
    return memeDialogues[Math.floor(Math.random() * memeDialogues.length)];
  });
  const bubbleTimeoutRef = useRef<any>(null);

  // Performance shake/impact triggers
  const [isShaking, setIsShaking] = useState(false);
  const [isMilestoneActive, setIsMilestoneActive] = useState(false);

  // Wake Lock & Immersive Fullscreen states
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock request deferred', err);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.warn('Wake Lock release ignored', err);
      }
    }
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused && !isGameOver) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isPlaying, isPaused, isGameOver, requestWakeLock, releaseWakeLock]);

  // Android back interrupts receiver support
  useEffect(() => {
    const handleAndroidBack = (e: Event) => {
      e.preventDefault();
      setShowExitDialog(true);
    };
    window.addEventListener('androidBack', handleAndroidBack);
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExitDialog(true);
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('androidBack', handleAndroidBack);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Dynamic background music generator matching selected theme
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || !soundEnabled) return;
    
    let step = 0;
    const intervalTime = activeTheme === 'midnight' ? 700 : activeTheme === 'rainy' ? 600 : 450; // Cozy, relax, or high-energy tempos
    
    const intervalId = setInterval(() => {
      playThemeAmbientStep(activeTheme, step);
      step = (step + 1) % 16;
    }, intervalTime);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, isPaused, isGameOver, soundEnabled, activeTheme]);

  // References to bypass React stale closures in requestAnimationFrame tick physics loops
  const statsRef = useRef({
    score: 0,
    lives: 5,
    brewProgress: 0,
    isPlaying: false,
    isPaused: false,
    speedMultiplier: 1.0,
    specialChaiCount: 0,
    gameMode: 'classic' as 'classic' | 'timeattack',
    timeLeft: 20.0,
    combo: 0,
    sessionGingerTapped: 0,
    sessionBadItemsTapped: 0,
    sessionSpecialBrews: 0,
  });

  // Sync state values with running physics thread
  useEffect(() => {
    statsRef.current = {
      score,
      lives,
      brewProgress,
      isPlaying,
      isPaused,
      speedMultiplier,
      specialChaiCount,
      gameMode,
      timeLeft,
      combo,
      sessionGingerTapped,
      sessionBadItemsTapped,
      sessionSpecialBrews,
    };
  }, [score, lives, brewProgress, isPlaying, isPaused, speedMultiplier, specialChaiCount, gameMode, timeLeft, combo, sessionGingerTapped, sessionBadItemsTapped, sessionSpecialBrews]);


  // Handle Splash Autoclose after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Sync high scores to client storage
  useEffect(() => {
    if (gameMode === 'classic') {
      if (score > highScoreClassic) {
        setHighScoreClassic(score);
        try {
          localStorage.setItem('chai_challenge_high_score_classic', score.toString());
        } catch (err) {
          console.warn(err);
        }
      }
    } else {
      if (score > highScoreTimeAttack) {
        setHighScoreTimeAttack(score);
        try {
          localStorage.setItem('chai_challenge_high_score_timeattack', score.toString());
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }, [score, gameMode, highScoreClassic, highScoreTimeAttack]);

  // Haptic Feedback API wrapped safely for Android WebView standard
  const triggerVibration = useCallback((type: 'success' | 'error' | 'gameover') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        if (type === 'success') {
          navigator.vibrate(12);
        } else if (type === 'error') {
          navigator.vibrate([30, 50, 30]);
        } else if (type === 'gameover') {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (e) {
        // Suppress on devices with strict security
      }
    }
  }, []);

  // Procedural audio player helper supporting sound settings
  const triggerSound = useCallback((type: 'success' | 'error' | 'powerup' | 'gameover' | 'click' | 'ticktock' | 'celebrate') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'success':
        playSuccessSound();
        break;
      case 'error':
        playErrorSound();
        break;
      case 'powerup':
        playPowerUpSound();
        break;
      case 'gameover':
        playGameOverSound();
        break;
      case 'click':
        playClickSound();
        break;
      case 'ticktock':
        playTickTockSound();
        break;
      case 'celebrate':
        playCelebrationSound();
        break;
    }
  }, [soundEnabled]);

  // Update finished game metrics to evaluate progress toward active missions
  const updateMissionsWithFinalStats = useCallback((finalGinger: number, finalBad: number, finalSpecial: number) => {
    setMissions((prevMissions) => {
      let changed = false;
      const updated = prevMissions.map((m) => {
        if (m.completed) return m;

        let nextCurrent = m.current;
        if (m.type === 'ginger_tap') {
          nextCurrent = Math.max(m.current, finalGinger);
        } else if (m.type === 'no_bad_items_game') {
          if (finalBad === 0) {
            nextCurrent = m.current + 1;
          }
        } else if (m.type === 'royal_brew_master') {
          nextCurrent = Math.max(m.current, finalSpecial);
        }

        const isCompletedNow = nextCurrent >= m.target;
        if (nextCurrent !== m.current || isCompletedNow) {
          changed = true;
          return {
            ...m,
            current: Math.min(m.target, nextCurrent),
            completed: isCompletedNow,
          };
        }
        return m;
      });

      if (changed) {
        setTimeout(() => {
          triggerSound('celebrate');
        }, 800);
      }
      return updated;
    });
  }, [triggerSound]);

  // Claim points reward from completed mission
  const claimMissionReward = (missionId: string) => {
    setMissions((curr) => {
      const match = curr.find((m) => m.id === missionId);
      if (!match || !match.completed || match.claimed) return curr;

      // Update total reputation bonus points count
      setTotalReputation((prev) => prev + match.rewardPoints);
      triggerSound('powerup');
      triggerSound('celebrate');
      speakHindi(`Wah bhaiya! ${match.title} complete! Bonus score claimed!`);

      return curr.map((m) => (m.id === missionId ? { ...m, claimed: true } : m));
    });
  };

  // Allow resetting missions manually for continuous testing/replayability
  const resetAllMissions = () => {
    triggerSound('click');
    setMissions(INITIAL_MISSIONS);
    speakHindi("Naye challenge ready hain bhaaia! Chalo tap karo!");
  };


  // Central game over states and voice synthesis effect
  const triggerGameOverEffect = useCallback((randomMeme: string) => {
    setIsPlaying(false);
    setIsGameOver(true);
    triggerSound('gameover');
    triggerVibration('gameover');
    setWalaExpression('sad');
    setWalaQuote(randomMeme);
    setLastWrongDialogue(randomMeme); // Persist for Game Over Screen

    // Speak Game Over in Hindi and then speak the meme text of why you failed
    speakHindi("Game Over! Aapki chai barbaad ho gayi! " + randomMeme);

    // Evaluate daily missions at the end of Classic game
    updateMissionsWithFinalStats(
      statsRef.current.sessionGingerTapped,
      statsRef.current.sessionBadItemsTapped,
      statsRef.current.sessionSpecialBrews
    );
  }, [triggerSound, triggerVibration, speakHindi, updateMissionsWithFinalStats]);


  // Generate Dolly-wala dialogue reaction on user taps
  const triggerWalaReaction = useCallback((type: 'success' | 'crit_fail' | 'normal_fail') => {
    // Clear any previous speech bubble timers
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    if (type === 'success') {
      const randomSuccess = SUCCESS_MEMES[Math.floor(Math.random() * SUCCESS_MEMES.length)];
      setWalaExpression('happy');
      setWalaQuote(randomSuccess);

      // Make speech bubble disappear after exactly 1.5 seconds
      bubbleTimeoutRef.current = setTimeout(() => {
        setWalaQuote('');
      }, 1500);
    } else {
      const randomError = memeDialogues[Math.floor(Math.random() * memeDialogues.length)];
      setWalaExpression('shocked');
      setWalaQuote(randomError);
      setLastWrongDialogue(randomError); // Persist for Game Over Screen
      speakHindi(randomError); // Speaks wrong tap meme aloud

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      // Make speech bubble disappear after exactly 1.5 seconds
      bubbleTimeoutRef.current = setTimeout(() => {
        setWalaQuote('');
      }, 1500);
    }

    // Reset Chaiwala back to normal stance after delay
    setTimeout(() => {
      setWalaExpression((prev) => (prev !== 'sad' ? 'idle' : 'sad'));
    }, 2000);
  }, [speakHindi]);

  // Spawn visual score text popup
  const spawnPointLabel = useCallback((text: string, x: number, y: number, color: string) => {
    const newLabel: PointLabel = {
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      timestamp: Date.now(),
    };
    setPointLabels((prev) => [...prev, newLabel]);
  }, []);

  // Spawn physics burst particles with low-end CPU optimized fallback
  const spawnParticlesMultiplier = useCallback((emoji: string, startX: number, startY: number) => {
    let count = 8;
    // Lower active count for legacy low-resource mobile processors
    if (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) < 4) {
      count = 4;
    }
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 4;
      newParticles.push({
        id: Math.random().toString(),
        x: startX,
        y: startY,
        emoji,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2, // Slight upward boost
        life: 1.0,
        rotation: Math.random() * 360,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Spawn ingredient/bad items matching progressive rates
  const spawnItem = useCallback(() => {
    const currentScore = statsRef.current.score;
    let pool = [...INGREDIENTS_POOL];

    // Pick random item
    const randomIdx = Math.floor(Math.random() * pool.length);
    const prototype = pool[randomIdx];

    const startX = 10 + Math.random() * 80;

    // Difficulty calculation matching prompt rule: falling item speed scales up every 10 points
    const difficultyLevel = Math.floor(currentScore / 10);
    const speedBonus = difficultyLevel * 0.08;

    // After 30 points: bad items start falling faster (+40% speed boost)
    let badItemsSpeedFactor = 1.0;
    if (currentScore >= 30 && prototype.category === 'bad') {
      badItemsSpeedFactor = 1.45;
    }

    const baseSpeed = prototype.category === 'good' ? 0.38 : 0.44;
    const speed = (baseSpeed + speedBonus + Math.random() * 0.15) * badItemsSpeedFactor;

    const newItem: FallingItem = {
      id: Math.random().toString(),
      type: prototype.id,
      emoji: prototype.emoji,
      category: prototype.category,
      x: startX,
      y: -8,
      speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      isTapped: false,
      scale: 1.0,
    };

    setFallingItems((prev) => [...prev, newItem]);
  }, []);

  // Auto-pause when user hides the browser tab / leaves window to minimize sound or battery drain
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && statsRef.current.isPlaying && !statsRef.current.isPaused) {
        setIsPaused(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Setup Android exit handling override behavior
  useEffect(() => {
    const handleBackButton = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowExitDialog(true);
      }
    };
    window.addEventListener('keydown', handleBackButton);
    return () => window.removeEventListener('keydown', handleBackButton);
  }, []);

  // Game tick loop integrating delta-timed update triggers
  useEffect(() => {
    let lastTime = performance.now();
    let spawnAccumulator = 0;
    let countdownThreshold = 0;
    let frameId: number;

    const tick = (now: number) => {
      const stats = statsRef.current;
      if (!stats.isPlaying || stats.isPaused) {
        lastTime = now;
        frameId = requestAnimationFrame(tick);
        return;
      }

      const deltaMs = now - lastTime;
      lastTime = now;

      // Handle custom 10s Time Attack countdown
      if (stats.gameMode === 'timeattack') {
        const nextTimeLeft = Math.max(0, stats.timeLeft - deltaMs / 1000);
        setTimeLeft(nextTimeLeft);

        // Tick-tock audio effect every second boundary
        countdownThreshold += deltaMs;
        if (countdownThreshold >= 1000 && nextTimeLeft > 0) {
          triggerSound('ticktock');
          countdownThreshold = 0;
        }

        if (nextTimeLeft <= 0) {
          // Time Up - Instant Game Over!
          setIsPlaying(false);
          setIsGameOver(true);
          triggerSound('gameover');
          triggerVibration('gameover');
          setWalaExpression('sad');
          const timeEndQuote = "Time khatam! Dekhte hain kitne points mile!";
          setWalaQuote(timeEndQuote);
          setLastWrongDialogue(timeEndQuote);
          speakHindi(timeEndQuote);

          // Evaluate daily missions at the end of Time Attack game
          updateMissionsWithFinalStats(
            statsRef.current.sessionGingerTapped,
            statsRef.current.sessionBadItemsTapped,
            statsRef.current.sessionSpecialBrews
          );
          return;
        }
      }

      // Update falling items physics placements
      setFallingItems((prev) => {
        const remaining: FallingItem[] = [];
        for (const item of prev) {
          if (item.isTapped) continue;

          // Gravity calculation
          const nextY = item.y + item.speed * (deltaMs / 16.67);

          if (nextY >= 96) {
            // Crossed the bottom boundary (missed item)
            if (item.category === 'good' && stats.gameMode === 'classic') {
              // Lose live on missed good item (only in classic)
              triggerSound('error');
              triggerVibration('error');
              triggerWalaReaction('normal_fail');
              setCombo(0); // Break combo list

              setLives((curr) => {
                const nextLives = curr - 1;
                if (nextLives <= 0) {
                  // Game over
                  const randomGameOverMeme = memeDialogues[Math.floor(Math.random() * memeDialogues.length)];
                  triggerGameOverEffect(randomGameOverMeme);
                }
                return Math.max(0, nextLives);
              });

              spawnPointLabel('💔 MISSED!', item.x, 88, 'text-red-400 font-extrabold text-xs');
            }
          } else {
            remaining.push({
              ...item,
              y: nextY,
              rotation: item.rotation + item.rotationSpeed * (deltaMs / 16.67),
            });
          }
        }
        return remaining;
      });

      // Update particle physics
      setParticles((prevParticles) => {
        const filtered: Particle[] = [];
        for (const p of prevParticles) {
          const nextLife = p.life - 0.035 * (deltaMs / 16.67);
          if (nextLife > 0) {
            filtered.push({
              ...p,
              x: p.x + p.vx * 0.15 * (deltaMs / 16.67),
              y: p.y + p.vy * 0.15 + 0.1 * (deltaMs / 16.67), // Gravitational bend
              vy: p.vy + 0.11 * (deltaMs / 16.67),
              life: nextLife,
              rotation: p.rotation * 1.05,
            });
          }
        }
        return filtered;
      });

      // Spawn items interval timer
      const currentScore = stats.score;
      // In Time Attack, items fall faster and spawn at double density
      const baseThreshold = stats.gameMode === 'timeattack' ? 700 : 1500;
      const spawnRateLimit = stats.gameMode === 'timeattack' ? 400 : 600;
      const spawnInterval = Math.max(spawnRateLimit, baseThreshold - currentScore * 4.5);

      spawnAccumulator += deltaMs;
      if (spawnAccumulator >= spawnInterval) {
        spawnItem();
        // After 50 points: ingredients start appearing in pairs!
        if (currentScore >= 50 && Math.random() < 0.65) {
          setTimeout(() => spawnItem(), 180);
        }
        spawnAccumulator = 0;
      }

      frameId = requestAnimationFrame(tick);
    };

    if (isPlaying && !isPaused) {
      frameId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, isPaused, spawnItem, triggerSound, triggerWalaReaction, triggerVibration, spawnPointLabel]);

  // Clean point labels array over time to avoid RAM leaks
  useEffect(() => {
    const cleaner = setInterval(() => {
      const timeout = 1200;
      setPointLabels((prev) => prev.filter((p) => Date.now() - p.timestamp < timeout));
    }, 500);
    return () => clearInterval(cleaner);
  }, []);

  // Handle game start
  const handleStartGame = (mode: 'classic' | 'timeattack') => {
    triggerSound('click');
    setGameMode(mode);
    setScore(0);
    setLives(5);
    setCombo(0);
    setBrewProgress(0);
    setSpecialChaiCount(0);
    setSpeedMultiplier(1.0);
    setTimeLeft(mode === 'timeattack' ? 20.0 : 20.0);
    setFallingItems([]);
    setPointLabels([]);
    setParticles([]);
    setWalaExpression('idle');
    setWalaQuote(
      mode === 'classic'
        ? 'Dolly Tapree Chalu! Let\'s brew classic masala cutting chai! 🍂☕'
        : 'Time Attack Challenge! Speed 20s tap race is ON! ⚡⚡'
    );

    // Clear Daily Mission session metrics at startup
    setSessionGingerTapped(0);
    setSessionBadItemsTapped(0);
    setSessionSpecialBrews(0);

    setIsPaused(false);
    setIsGameOver(false);
    setIsPlaying(true);

    if (mode === 'timeattack') {
      speakHindi("Bees second challenge shuru! Jaldi tap karo!");
    } else {
      speakHindi("Chalo bhaaya, ekdum swadi kadak cutting banaye!");
    }

    // Screen setup for Android immersive support
    try {
      const anyOrientation = screen.orientation as any;
      if (anyOrientation && anyOrientation.lock) {
        anyOrientation.lock('portrait').catch(() => {});
      }
    } catch (e) {}
  };

  // Click/Tap handling on falling items
  const handleItemTap = (event: React.MouseEvent | React.TouchEvent, item: FallingItem) => {
    if (item.isTapped || !isPlaying || isPaused) return;
    event.stopPropagation();
    if (event.cancelable) {
      event.preventDefault();
    }

    // Mark item as tapped immediately to prevent double processing
    setFallingItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, isTapped: true } : it)));

    const proto = INGREDIENTS_POOL.find((x) => x.id === item.type);
    if (!proto) return;

    // Trigger visual particles & sounds
    spawnParticlesMultiplier(item.emoji, item.x, item.y);

    if (proto.category === 'good') {
      // Good item tapped!
      triggerSound('success');
      triggerVibration('success');
      setFlashState('success');
      setTimeout(() => setFlashState('none'), 120);

      // Save ginger count for achievement tracking
      if (proto.id === 'ginger') {
        setSessionGingerTapped((prev) => prev + 1);
      }

      const nextCombo = combo + 1;
      setCombo(nextCombo);

      // Play special sound when hits milestones e.g. every 10 points
      const pointsGain = proto.points;
      const previousTenBoundary = Math.floor(score / 10);
      const nextScore = score + pointsGain;
      const nextTenBoundary = Math.floor(nextScore / 10);

      if (nextTenBoundary > previousTenBoundary && nextScore > 0) {
        triggerSound('celebrate');
        spawnPointLabel('⭐ CHAI MILIESTONE COINS! ⭐', 50, 40, 'text-amber-400 font-black text-center text-md w-full');
      }

      setScore(nextScore);
      triggerWalaReaction('success');

      // Check and speak milestone sounds
      speakMilestone(nextScore);

      // Combo factor string
      const comboText = nextCombo > 2 ? ` x${nextCombo} Combo!` : '';
      spawnPointLabel(`+${pointsGain}${comboText} ${proto.name}`, item.x, item.y, 'text-emerald-400 font-extrabold text-sm');

      // Increase Classic brew progress indicator
      if (gameMode === 'classic') {
        setBrewProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            // Boil jackpot reached!
            setTimeout(() => {
              triggerSound('powerup');
              setIsMilestoneActive(true);
              setSpecialChaiCount((cnt) => cnt + 1);
              setSessionSpecialBrews((prevBrews) => prevBrews + 1);
              setScore((s) => {
                const updatedScore = s + 150;
                speakMilestone(updatedScore);
                return updatedScore;
              });
              setLives((curr) => Math.min(5, curr + 1));
              spawnPointLabel('☕ ROYAL CUTTING CHAI POT! +150 & 💖 Bonus Life Refilled!', 50, 45, 'text-amber-300 font-black text-base text-center w-full');

              setTimeout(() => {
                setIsMilestoneActive(false);
              }, 1800);
            }, 50);
            return 0;
          }
          return next;
        });
      }
    } else {
      // BAD item tapped (e.g. spider, burger, samosa)
      triggerSound('error');
      triggerVibration('error');
      setFlashState('error');
      setTimeout(() => setFlashState('none'), 180);
      setCombo(0); // Break combo multiplier list

      // Track bad item tapped count for achievements
      setSessionBadItemsTapped((prev) => prev + 1);

      const damageValue = Math.abs(proto.points);
      setScore((prev) => Math.max(0, prev - damageValue));
      triggerWalaReaction('crit_fail');
      spawnPointLabel(`💥 OH TRASH! ${proto.emoji} ${proto.name} -${damageValue}`, item.x, item.y, 'text-red-500 font-black text-sm scale-110');

      if (gameMode === 'classic') {
        setLives((curr) => {
          const nextLives = curr - 1;
          if (nextLives <= 0) {
            const randomGameOverMeme = memeDialogues[Math.floor(Math.random() * memeDialogues.length)];
            triggerGameOverEffect(randomGameOverMeme);
          }
          return Math.max(0, nextLives);
        });
      }
    }
  };

  const currentHighScore = gameMode === 'classic' ? highScoreClassic : highScoreTimeAttack;

  return (
    <div 
      className="min-h-screen bg-[#0d0705] py-4 px-3 flex flex-col items-center justify-center font-sans relative overflow-hidden select-none responsive-container"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 16px) + 8px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 8px)',
        paddingLeft: 'calc(env(safe-area-inset-left, 12px) + 4px)',
        paddingRight: 'calc(env(safe-area-inset-right, 12px) + 4px)',
      }}
    >
      {/* Visual background lights ambient glow */}
      <div className="absolute top-[8%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[8%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-orange-700/5 blur-[130px] pointer-events-none" />

      {/* Screen flash impact layers */}
      <AnimatePresence>
        {flashState !== 'none' && (
          <motion.div
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 pointer-events-none ${
              flashState === 'success' ? 'bg-[#10b981]/25' : 'bg-[#ef4444]/35'
            }`}
          />
        )}
      </AnimatePresence>

      {/* Splash Onboarding overlay screen for immersive feel */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0c0605] z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ y: [-10, 0, -10], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="text-8xl select-none"
              >
                ☕♨️
              </motion.div>
              {/* Steaming cloud rises */}
              <motion.span
                animate={{ y: [-20, -50], opacity: [0, 0.7, 0], scale: [0.8, 1.4] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute top-2 left-6 text-xl"
              >
                💭
              </motion.span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#d4af37] to-amber-600 tracking-wider">
              Chai Tap Challenge
            </h1>
            <p className="text-amber-200/70 text-xs md:text-sm font-semibold tracking-widest uppercase mt-2 font-mono">
              ★ Play Store Android Ready Edition ★
            </p>
            <div className="w-48 bg-[#251512] h-2 rounded-full overflow-hidden mt-8 p-0.5 border border-[#4e2f29]">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
              />
            </div>
            <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase">
              Spices boiling, Dolly Tea cups ready...
            </p>

            <button
              onClick={() => setShowSplash(false)}
              className="mt-8 text-xs text-amber-500/80 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
            >
              Skip Loading &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Arcade Casing Frame container */}
      <main
        className={`w-full max-w-md bg-[#251512] rounded-[2.5rem] p-4 flex flex-col border-[6px] border-[#3e2723] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-300 h-[800px] min-h-[800px] responsive-main ${
          isShaking ? 'animate-[shake_0.25s_ease-in-out_infinite]' : ''
        }`}
      >
        {/* Metal Corner Screws decoratives */}
        <div className="absolute top-2.5 left-6 w-2.5 h-2.5 bg-zinc-600 rounded-full border border-zinc-800 shadow-inner" />
        <div className="absolute top-2.5 right-6 w-2.5 h-2.5 bg-zinc-600 rounded-full border border-zinc-800 shadow-inner" />
        <div className="absolute bottom-2.5 left-6 w-2.5 h-2.5 bg-zinc-600 rounded-full border border-zinc-800 shadow-inner" />
        <div className="absolute bottom-2.5 right-6 w-2.5 h-2.5 bg-zinc-600 rounded-full border border-zinc-800 shadow-inner" />

        {/* Dashboard statistics rows */}
        <ScoreBoard
          score={score}
          highScore={currentHighScore}
          lives={lives}
          maxLives={5}
          brewProgress={brewProgress}
          specialChaiCount={specialChaiCount}
          isPaused={isPaused}
          soundEnabled={soundEnabled}
          gameMode={gameMode}
          timeLeft={timeLeft}
          combo={combo}
          isPlaying={isPlaying}
          onTogglePause={() => {
            triggerSound('click');
            setIsPaused((prev) => !prev);
          }}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onShowHelp={() => {
            triggerSound('click');
            setShowHelp(true);
          }}
        />

        {/* Playfield Case Area */}
        <div
          id="playfield-screen"
          className="flex-1 mt-4 rounded-3xl overflow-hidden border-4 border-[#1c100e] relative min-h-[320px] sm:h-[500px] select-none cursor-crosshair bg-[#1a0c0a] shadow-inner"
        >
          {/* Ambient Background layer */}
          <ChaiBackground theme={activeTheme} />

          {/* Gameplay elements with smooth fade transitions */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                key="gameplay-hud-and-elements"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 pointer-events-none z-10"
              >
                {/* Mobile Gameplay HUD (strictly visible on small mobile screens to satisfy requirements) */}
                {!isPaused && (
                  <div className="absolute top-0 inset-x-0 p-3 flex justify-between items-center z-40 pointer-events-none md:hidden bg-gradient-to-b from-[#1a0c0a]/90 via-[#1a0c0a]/40 to-transparent">
                    {/* Score Display (Top Left, 36-48px on mobile) */}
                    <div className="flex flex-col items-start bg-[#2d1b18]/90 border border-amber-600/50 rounded-xl px-2.5 py-1 backdrop-blur-md shadow-lg pointer-events-none z-50">
                      <span className="text-[8px] text-amber-200/70 font-bold tracking-widest uppercase mb-0.5">BREW SCORE</span>
                      <span className="text-3xl sm:text-4xl font-black font-mono leading-none text-white">
                        {score}
                      </span>
                    </div>

                    {/* Timer / Progress Display (Top Center, 40-48px on mobile, z-index and container ensures no overlap) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-2 pointer-events-none z-55 flex flex-col items-center">
                      {gameMode === 'timeattack' ? (
                        <div className="bg-[#1a0c0a]/95 border-2 border-red-500 rounded-2xl px-3.5 py-1 text-center shadow-[0_0_15px_rgba(239,68,68,0.5)] backdrop-blur-md z-50 min-w-[110px]">
                          <span className="text-[8px] text-red-400 font-extrabold tracking-widest uppercase block leading-none mb-0.5">TIME LEFT</span>
                          <span className={`text-[40px] font-black font-mono tracking-tighter leading-none ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
                            {timeLeft.toFixed(1)}s
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#1a0c0a]/95 border-2 border-amber-500 rounded-2xl px-3.5 py-1 text-center shadow-[0_0_15px_rgba(245,158,11,0.3)] backdrop-blur-md z-50 min-w-[110px]">
                          <span className="text-[8px] text-amber-400 font-extrabold tracking-widest uppercase block leading-none mb-1">BREWING</span>
                          <span className="text-2xl font-black font-mono leading-none text-white">
                            {brewProgress}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Lives (Kulhad Cups) (Top Right, properly padded, no overlay with timer) */}
                    <div className="flex flex-col items-end bg-[#2d1b18]/90 border border-[#5d4037]/50 rounded-xl px-2.5 py-1 backdrop-blur-md shadow-lg pointer-events-none z-50">
                      <span className="text-[8px] text-amber-200/70 font-bold tracking-widest uppercase mb-0.5">KULHADS</span>
                      <div className="flex space-x-1 items-center mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const active = i < lives;
                          return (
                            <span key={i} className={`text-base leading-none transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-25 scale-75 filter grayscale'}`}>
                              ☕
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Falling items items viewport wrapper */}
                {!isPaused && (
                  <div className="absolute inset-0 z-10 overflow-hidden pointer-events-auto">
                    {fallingItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                        }}
                        className="absolute select-none"
                        onMouseDown={(e) => handleItemTap(e, item)}
                        onTouchStart={(e) => handleItemTap(e, item)}
                      >
                        {/* Dynamic hovering item containments */}
                        <div
                          className="w-12 h-12 flex items-center justify-center text-3xl cursor-pointer select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.55)] transition-all bg-stone-900/15 hover:bg-white/5 active:scale-75 rounded-full p-1 border border-transparent hover:border-amber-500/25 active:border-amber-400"
                        >
                          <span>{item.emoji}</span>
                        </div>
                      </div>
                    ))}

                    {/* Graphical particles array */}
                    {particles.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          opacity: p.life,
                          transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${0.5 + p.life * 0.7})`,
                        }}
                        className="absolute text-xl pointer-events-none z-10 select-none"
                      >
                        {p.emoji}
                      </div>
                    ))}
                  </div>
                )}

                {/* Points alerts toasts */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <AnimatePresence>
                    {pointLabels.map((lbl) => (
                      <motion.div
                        key={lbl.id}
                        initial={{ opacity: 0, y: `${lbl.y}%`, scale: 0.8 }}
                        animate={{ opacity: 1, y: `${lbl.y - 12}%`, scale: 1.15 }}
                        exit={{ opacity: 0, y: `${lbl.y - 25}%` }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                        style={{ left: `${lbl.x}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md text-center font-black ${lbl.color} pointer-events-none select-none`}
                      >
                        {lbl.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Interactive animated combo texts */}
                {combo >= 4 && !isPaused && (
                  <div className="absolute bottom-16 right-4 pointer-events-none z-20 select-none bg-rose-600/90 border border-rose-400 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider scale-110 animate-bounce">
                    🔥 TAPPING COMBO: x{combo}!
                  </div>
                )}

                {/* Splash milestone banner splash */}
                <AnimatePresence>
                  {isMilestoneActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-amber-950/80 z-30 pointer-events-none"
                    >
                      <div className="text-6xl animate-bounce">👑</div>
                      <h3 className="text-lg font-black text-amber-300 uppercase tracking-widest mt-2 text-center drop-shadow">
                        Perfect Spiced Brew!
                      </h3>
                      <p className="text-xs text-white font-bold text-center">
                        +150 Points Reward & Premium Kulhad Cup Life Reloaded!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dolly-wala Meme reactions */}
          <ChaiMemeWala expression={walaExpression} currentQuote={walaQuote} />

          {/* Steam brewing liquid kettle bottom bar indicator */}
          <KettleLiquid brewProgress={gameMode === 'classic' ? brewProgress : 0} expression={walaExpression} />

          {/* Dashboard Menu Splash Row with smooth transitions */}
          <AnimatePresence>
            {!isPlaying && !isGameOver && (
              <motion.div
                key="main-menu-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 bg-gradient-to-b from-[#140a08]/95 via-[#23120f]/95 to-[#140a08]/95 flex flex-col items-center justify-center p-6 text-center z-30 overflow-y-auto"
              >
                <motion.div
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="mb-5 flex flex-col items-center"
                >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-[3px] shadow-2xl relative mb-3">
                  <div className="w-full h-full bg-[#301a16] rounded-xl flex items-center justify-center text-3xl">
                    ☕🔥
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -top-2.5 -right-2 bg-rose-600 rounded-full text-[8.5px] font-black text-white px-2 py-0.5 shadow uppercase tracking-wider whitespace-nowrap"
                  >
                    KADAK!
                  </motion.div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase text-amber-400 tracking-wider">
                  Chai Tap Challenge
                </h1>
                <p className="text-stone-300 text-[11px] leading-relaxed mt-1 max-w-xs font-semibold px-2">
                  Taste the addiction! Tap organic cardamom, ginger, sugar & tea leaves. Save cups from toxic items!
                </p>
              </motion.div>

              {/* Interactive mode selectors */}
              <div className="w-full max-w-xs space-y-3">
                <button
                  onClick={() => handleStartGame('classic')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-650 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-all shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] active:scale-95 cursor-pointer flex items-center justify-center h-14"
                  id="btn-play-classic"
                >
                  <Coffee className="w-4 h-4 mr-2" /> ☕ Classic Mode
                </button>

                <button
                  onClick={() => handleStartGame('timeattack')}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-all shadow-[0_4px_15px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_25px_rgba(244,63,94,0.5)] active:scale-95 cursor-pointer flex items-center justify-center h-14"
                  id="btn-play-timeattack"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-300 animate-pulse" /> ⚡ 20s Time Attack
                </button>

                {/* Voice preference controls button */}
                <button
                  onClick={toggleVoice}
                  className={`w-full font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center border ${
                    !voiceSupported
                      ? 'bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed opacity-50'
                      : voiceEnabled
                      ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30'
                      : 'bg-stone-900 border-zinc-800 text-stone-400 hover:bg-stone-850'
                  }`}
                  id="btn-toggle-voice"
                >
                  {!voiceSupported ? '🔇 Voice Not Supported' : voiceEnabled ? '🔊 Voice is ON (Hindi)' : '🔇 Voice is OFF'}
                </button>

                {/* Tea Shop Theme Selector */}
                <div className="w-full bg-[#1c0f0e] border border-[#3e2723] rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-amber-200/90 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                    ☕ Choose Tapree Theme
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['morning', 'rainy', 'midnight'] as const).map((t) => {
                      const isActive = activeTheme === t;
                      const label = t === 'morning' ? '🌅 Morning' : t === 'rainy' ? '🌧️ Rainy' : '🌃 Midnight';
                      const desc = t === 'morning' ? 'Bright morning bazaar beat' : t === 'rainy' ? 'Cozy monsoon drizzle chords' : 'Lo-fi night stall pulse';
                      return (
                        <button
                          key={t}
                          onClick={() => handleThemeChange(t)}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[9.5px] font-bold cursor-pointer active:scale-95 transition-all ${
                            isActive
                              ? t === 'morning'
                                ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : t === 'rainy'
                                ? 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                                : 'bg-fuchsia-500/25 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                              : 'bg-stone-900 border-zinc-800 text-stone-400 hover:text-stone-300 hover:bg-stone-850'
                          }`}
                          title={desc}
                        >
                          <span className="truncate">{label}</span>
                          <span className="text-[7px] font-normal leading-tight opacity-75 mt-0.5">
                            {t === 'morning' ? 'Bazaar' : t === 'rainy' ? 'Monsoon' : 'Starry'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Best stats overview */}
                <div className="bg-[#1c0f0e] border border-[#3e2723] rounded-xl p-3 flex justify-evenly items-center">
                  <div className="text-center font-mono">
                    <p className="text-[9px] text-[#a1887f] font-bold uppercase tracking-wide">Best Classic</p>
                    <p className="text-amber-500 text-base font-black">{highScoreClassic} pts</p>
                  </div>
                  <div className="w-[1px] h-6 bg-stone-800" />
                  <div className="text-center font-mono">
                    <p className="text-[9px] text-[#a1887f] font-bold uppercase tracking-wide">Best 20s</p>
                    <p className="text-rose-400 text-base font-black">{highScoreTimeAttack} pts</p>
                  </div>
                </div>

                {/* Daily Missions Panel */}
                <div className="w-full bg-[#1c0f0e] border border-[#3e2723] rounded-xl p-3 text-left relative overflow-hidden">
                  <div className="flex justify-between items-center mb-2.5">
                    <p className="text-[10px] text-amber-200 font-bold uppercase tracking-widest flex items-center gap-1">
                      📜 Daily Missions
                    </p>
                    <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg px-2 py-0.5 text-[9px] font-black text-amber-300 flex items-center gap-1">
                      🏆 {totalReputation} ★
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                    {missions.map((m) => {
                      const pct = Math.min(100, (m.current / m.target) * 100);
                      return (
                        <div key={m.id} className="bg-stone-900/40 border border-[#3e2723]/60 rounded-lg p-2 flex flex-col gap-1.5 transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-[11px] font-black text-amber-200 leading-tight">
                                {m.title}
                              </p>
                              <p className="text-[9.5px] text-[#a1887f] font-semibold leading-relaxed mt-0.5">
                                {m.description}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {m.completed && !m.claimed ? (
                                <button
                                  onClick={() => claimMissionReward(m.id)}
                                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-[9px] font-black px-2 py-1 rounded shadow-md cursor-pointer animate-pulse whitespace-nowrap"
                                >
                                  Claim +{m.rewardPoints}
                                </button>
                              ) : m.claimed ? (
                                <span className="text-emerald-400 text-[10px] font-black flex items-center gap-0.5">
                                  ✓ Claimed
                                </span>
                              ) : (
                                <span className="text-amber-200/60 text-[9px] font-bold">
                                  +{m.rewardPoints} ★
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Line */}
                          {!m.claimed && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex-1 bg-stone-950 h-1.5 rounded-full overflow-hidden border border-stone-850">
                                <span
                                  className="bg-amber-500 h-full rounded-full transition-all duration-300 block"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono font-bold text-amber-305/85 shrink-0">
                                {m.current}/{m.target}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={resetAllMissions}
                      className="text-[8px] text-[#a1887f] hover:text-amber-400 tracking-wider font-bold uppercase transition-all flex items-center gap-0.5 cursor-pointer"
                    >
                      🔄 Reset All Progress
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setShowExitDialog(true);
                    }}
                    className="bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-300 py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
                  >
                    Exit Game
                  </button>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setShowHelp(true);
                    }}
                    className="bg-stone-900 border border-[#3e2723] text-amber-200 hover:text-amber-300 py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
                  >
                    Recipes Guide
                  </button>
                </div>
              </div>

              {/* Tapree footer text stamp */}
              <p className="absolute bottom-3 text-[9px] text-[#ffe0b2]/30 font-mono tracking-widest uppercase">
                DOLLY STALL ENGINE • PWA PLAYSTORE RAPID
              </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause general backdrop screen overlays */}
          {isPaused && isPlaying && (
            <div className="absolute inset-0 bg-[#0c0605]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
              <span className="text-5xl mb-2 animate-bounce">😴☕</span>
              <h3 className="text-lg font-bold text-amber-400 uppercase tracking-widest leading-none">
                Tapree Paused!
              </h3>
              <p className="text-xs text-stone-300 max-w-xs leading-relaxed mt-2 mb-4 font-semibold">
                Dolly went to clean the glasses. Grab some fresh air and play again!
              </p>

              {/* In-Game Pause Theme Quick Switcher */}
              <div className="w-full max-w-[240px] bg-[#231512] border border-[#4e2f29] rounded-xl p-2 mb-5">
                <p className="text-[8.5px] text-amber-200/80 font-bold uppercase tracking-widest mb-1.5">
                  Change Vibe Mid-Session
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {(['morning', 'rainy', 'midnight'] as const).map((t) => {
                    const isActive = activeTheme === t;
                    const emoji = t === 'morning' ? '🌅' : t === 'rainy' ? '🌧️' : '🌃';
                    return (
                      <button
                        key={t}
                        onClick={() => handleThemeChange(t)}
                        className={`py-1 px-1.5 rounded-lg border text-[8.5px] font-bold cursor-pointer active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isActive
                            ? t === 'morning'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : t === 'rainy'
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300'
                            : 'bg-stone-900 border-zinc-800 text-stone-400'
                        }`}
                      >
                        <span>{emoji} {t.charAt(0).toUpperCase() + t.slice(1)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  triggerSound('click');
                  setIsPaused(false);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow active:scale-95 h-12 flex items-center justify-center"
                id="btn-resume-from-pause"
              >
                Back To Work! ⚡
              </button>
            </div>
          )}
        </div>

        {/* Traditional Tapree footer branding shelf line */}
        <div className="mt-4 flex justify-between items-center px-1">
          <div className="flex space-x-1.5 opacity-50">
            <span className="text-base">🥥</span>
            <span className="text-base">🍋</span>
          </div>
          <span className="text-[10px] text-[#8d6e63] font-bold tracking-widest uppercase select-none">
            cutting-chai machine v2.0
          </span>
          <div className="flex space-x-1.5 opacity-50">
            <span className="text-base">🍌</span>
            <span className="text-base">🌾</span>
          </div>
        </div>
      </main>

      {/* Exit dialog modal requested for Android back events */}
      <AnimatePresence>
        {showExitDialog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2d1b18] border border-amber-600 rounded-2xl max-w-xs w-full p-5 text-center text-white"
            >
              <div className="text-4xl mb-2">😢🛒</div>
              <h4 className="text-lg font-black text-amber-400">Exit Game?</h4>
              <p className="text-xs text-stone-300 my-2 leading-relaxed">
                Leaving already? Dolly is about to pour a warm, steaming cutting cup helper! Are you sure you want to exit?
              </p>
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <button
                  onClick={() => {
                    triggerSound('click');
                    setShowExitDialog(false);
                  }}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerSound('click');
                    setShowExitDialog(false);
                    // Close behavior or show goodbye message
                    alert('Thanks for playing Chai Tap Challenge! Dhanyawaad, fir milenge! 🙏☕');
                  }}
                  className="bg-red-650 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer select-none"
                >
                  Exit App
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recipes Instructions Guide overlay */}
      <AnimatePresence>
        {showHelp && (
          <HelpDialog
            onClose={() => {
              triggerSound('click');
              setShowHelp(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Game Over modal scorecard recap */}
      <AnimatePresence>
        {isGameOver && (
          <GameOverPanel
            score={score}
            highScore={currentHighScore}
            specialChaiCount={specialChaiCount}
            memeQuote={lastWrongDialogue}
            gameMode={gameMode}
            onRestart={() => handleStartGame(gameMode)}
            onMainMenu={() => {
              triggerSound('click');
              setIsGameOver(false);
              setIsPlaying(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
