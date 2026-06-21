/**
 * Web Audio API synthesizer for the Chai Tap Challenge game.
 * Uses procedural synthesis for retro 8-bit sound effects.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Quick pleasant high-pitched chime (arpeggio style)
    const playTone = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now + delay);
      
      gain.gain.setValueAtTime(0.15, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    // Fast ascending cutting-chai bells!
    playTone(523.25, 0, 0.1); // C5
    playTone(659.25, 0.05, 0.1); // E5
    playTone(783.99, 0.1, 0.15); // G5
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // Low buzz
    osc.frequency.linearRampToValueAtTime(110, now + 0.25);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playPowerUpSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Beautiful magical tea bubble sound
    const playBubble = (freq: number, start: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + start + 0.12);
      
      gain.gain.setValueAtTime(0.1, now + start);
      gain.gain.linearRampToValueAtTime(0.01, now + start + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + start);
      osc.stop(now + start + 0.13);
    };

    playBubble(400, 0);
    playBubble(500, 0.08);
    playBubble(650, 0.16);
    playBubble(800, 0.24);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playGameOverSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now); // E4
    osc.frequency.linearRampToValueAtTime(165, now + 0.6); // Falling pitch
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.7);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playTickTockSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, now);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.05);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

export function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Fun dynamic fanfare chime
    const playTone = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now + delay);
      
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playTone(523.25, 0, 0.12);     // C5
    playTone(659.25, 0.08, 0.12);  // E5
    playTone(783.99, 0.16, 0.12);  // G5
    playTone(1046.50, 0.24, 0.3);  // C6 (Triumphant octave strike)
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}

/**
 * Generates cozy, real-time procedural background music based on key themes.
 * Kept memory-light and performant to stay lag-free in WebViews!
 */
export function playThemeAmbientStep(theme: 'morning' | 'rainy' | 'midnight', step: number) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (theme === 'morning') {
      // Happy sunrise: major pentatonic sequences
      const majorPentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C4, D4, E4, G4, A4, C5, D5, E5
      const freq = majorPentatonic[step % majorPentatonic.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.3);
    } 
    else if (theme === 'rainy') {
      // Soft monsoon: minor ambient keys with simulated soft raindrop taps
      const minorScale = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // Am scale
      const freq = minorScale[(step * 2) % minorScale.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.7);

      // Random quick raindrop click effect
      if (Math.random() > 0.25) {
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(1400 + Math.random() * 600, now + Math.random() * 0.15);
        clickGain.gain.setValueAtTime(0.006, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start();
        clickOsc.stop(now + 0.03);
      }
    } 
    else if (theme === 'midnight') {
      // Intimate Midnight Stall: soft lofi warm deep sub-frequencies & neon echoes
      const bassFrequencies = [110.00, 110.00, 130.81, 146.83, 110.00, 110.00, 164.81, 146.83]; // A2, A2, C3, D3, A2, A2, E3, D3
      const rootFreq = bassFrequencies[step % bassFrequencies.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(rootFreq, now);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.55);

      // Cozy midnight starry chime echo
      if (step % 2 === 0) {
        const echoOsc = ctx.createOscillator();
        const echoGain = ctx.createGain();
        echoOsc.type = 'sine';
        echoOsc.frequency.setValueAtTime(rootFreq * 4, now + 0.12); // Two octaves up
        echoGain.gain.setValueAtTime(0.012, now + 0.12);
        echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        echoOsc.connect(echoGain);
        echoGain.connect(ctx.destination);
        echoOsc.start(now + 0.12);
        echoOsc.stop(now + 0.46);
      }
    }
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
}


