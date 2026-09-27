// ==========================================================================
// Web Audio API Soundscapes & Tactile Audio FX
// Adaptive Student Life Assistant (Zero external MP3 dependencies)
// ==========================================================================

const SoundSystem = (function() {
  let ctx = null;
  let isMuted = false;
  let masterGain = null;

  // Active ambient nodes
  let ambientNodes = null;
  let currentAmbientType = null;

  function initAudio() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
        masterGain.connect(ctx.destination);
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // --- Sound Effects ---
  function playPop(freq = 440) {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio effect prevented:', e);
    }
  }

  function playSuccessChime() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.09;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {}
  }

  function playGentleBell() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      // Tibetan bowl harmonic frequencies
      const freqs = [392.00, 784.00, 1176.00];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const initialVol = 0.25 / (i + 1);
        gain.gain.setValueAtTime(initialVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 3.5);
      });
    } catch (e) {}
  }

  function playFanfare() {
    if (isMuted) return;
    try {
      initAudio();
      if (!ctx) return;
      // Bright triumphant fanfare: C5, G5, C6, E6
      const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      arpeggio.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.11;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    } catch (e) {}
  }

  // --- Ambient Generators ---
  function stopAmbient() {
    if (ambientNodes) {
      if (ambientNodes.interval) clearInterval(ambientNodes.interval);
      if (ambientNodes.source) {
        try { ambientNodes.source.stop(); } catch (e) {}
      }
      if (ambientNodes.gain) {
        ambientNodes.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      }
      ambientNodes = null;
    }
    currentAmbientType = null;
  }

  function startAmbient(type) {
    initAudio();
    if (!ctx) return;
    if (currentAmbientType === type) {
      stopAmbient();
      return false; // Turned off
    }
    stopAmbient();
    currentAmbientType = type;

    const ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 1.0);
    ambientGain.connect(masterGain);

    if (type === 'rain') {
      // Pink/Brownish noise generator with dual lowpass
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(ambientGain);
      whiteNoise.start();

      ambientNodes = { source: whiteNoise, gain: ambientGain };
      return true;
    }

    if (type === 'fireplace') {
      // Crackle simulation with filtered noise bursts & rumble
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      noise.connect(filter);
      filter.connect(ambientGain);
      noise.start();

      // Intermittent crackles
      const crackleInterval = setInterval(() => {
        if (!currentAmbientType || isMuted) return;
        if (Math.random() > 0.4) {
          const osc = ctx.createOscillator();
          const popGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200 + Math.random() * 1200, ctx.currentTime);
          popGain.gain.setValueAtTime(0.04 + Math.random() * 0.06, ctx.currentTime);
          popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02 + Math.random() * 0.04);
          osc.connect(popGain);
          popGain.connect(ambientGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.06);
        }
      }, 180);

      ambientNodes = { source: noise, gain: ambientGain, interval: crackleInterval };
      return true;
    }

    if (type === 'cafe') {
      // Warm low frequency acoustic rumble & distant harmonic movement
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.03;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      noise.connect(filter);
      filter.connect(ambientGain);
      noise.start();

      ambientNodes = { source: noise, gain: ambientGain };
      return true;
    }

    if (type === 'lofi') {
      // Gentle soothing pentatonic notes playing in cycle
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let step = 0;
      const lofiInterval = setInterval(() => {
        if (!currentAmbientType || isMuted) return;
        const note = pentatonic[(step++) % pentatonic.length];
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        
        noteGain.gain.setValueAtTime(0.08, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        osc.connect(noteGain);
        noteGain.connect(ambientGain);
        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      }, 2400);

      ambientNodes = { gain: ambientGain, interval: lofiInterval };
      return true;
    }

    if (type === 'birds') {
      // Soft forest breeze background noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const breeze = ctx.createBufferSource();
      breeze.buffer = noiseBuffer;
      breeze.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      breeze.connect(filter);
      filter.connect(ambientGain);
      breeze.start();

      // Generative sweet nature bird chirps
      const birdInterval = setInterval(() => {
        if (!currentAmbientType || isMuted) return;
        if (Math.random() > 0.3) {
          const baseFreq = 2600 + Math.random() * 1200;
          const chirpCount = Math.random() > 0.5 ? 2 : 1;
          for (let c = 0; c < chirpCount; c++) {
            const osc = ctx.createOscillator();
            const chirpGain = ctx.createGain();
            const startTime = ctx.currentTime + c * 0.09;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, startTime);
            osc.frequency.exponentialRampToValueAtTime(baseFreq + 800 + Math.random() * 600, startTime + 0.04);
            osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, startTime + 0.08);

            chirpGain.gain.setValueAtTime(0.001, startTime);
            chirpGain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.02);
            chirpGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

            osc.connect(chirpGain);
            chirpGain.connect(ambientGain);
            osc.start(startTime);
            osc.stop(startTime + 0.085);
          }
        }
      }, 1400);

      ambientNodes = { source: breeze, gain: ambientGain, interval: birdInterval };
      return true;
    }

    return false;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.35, ctx.currentTime);
    }
    return isMuted;
  }

  function setVolume(level) {
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(level, ctx.currentTime);
    }
  }

  return {
    init: initAudio,
    playPop,
    playSuccessChime,
    playGentleBell,
    playFanfare,
    startAmbient,
    stopAmbient,
    toggleMute,
    setVolume,
    getCurrentAmbient: () => currentAmbientType
  };
})();
