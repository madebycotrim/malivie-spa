/**
 * ASMR Web Audio Engine - Maliviê SPA
 * Sintetizador procedural orgânico de áudio ASMR reproduzindo a experiência
 * do Arco Hídrico Circular do Head Spa, fluxo contínuo de água termal morna e
 * borbulhas terapêuticas, sem dependência de conexões externas.
 */

type SoundStateListener = (isPlaying: boolean) => void;

class AsmrSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private dropletInterval: number | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isCurrentlyPlaying = false;
  private listeners: Set<SoundStateListener> = new Set();
  private volumeLevel = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createWaterNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 4; // 4 seconds loop
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Brown noise integration + gentle pink noise mix for soothing waterfall texture
    let lastOutL = 0.0;
    let lastOutR = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      // Brown noise formula
      lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
      lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;

      // Soft amplitude with stereo micro-decorrelation
      left[i] = lastOutL * 3.5;
      right[i] = lastOutR * 3.5;
    }

    return buffer;
  }

  private triggerDroplet() {
    if (!this.ctx || !this.isCurrentlyPlaying || !this.masterGain) return;

    try {
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const dropFilter = this.ctx.createBiquadFilter();

      const baseFreq = 800 + Math.random() * 500;
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

      dropFilter.type = 'bandpass';
      dropFilter.frequency.value = baseFreq;
      dropFilter.Q.value = 4;

      dropGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      dropGain.gain.linearRampToValueAtTime(0.04 * this.volumeLevel, this.ctx.currentTime + 0.015);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      dropOsc.connect(dropFilter);
      dropFilter.connect(dropGain);
      dropGain.connect(this.masterGain);

      dropOsc.start(this.ctx.currentTime);
      dropOsc.stop(this.ctx.currentTime + 0.14);
    } catch {
      // Ignore background audio interruptions
    }
  }

  public async play(): Promise<void> {
    try {
      this.initContext();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      if (this.isCurrentlyPlaying) return;

      const now = this.ctx.currentTime;

      // Master Gain with Soft Fade-In
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volumeLevel, now + 1.2);

      // Analyser for real-time SVG waveform animation
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // 1. Primary Warm Stream (Lowpass Water Body)
      const noiseBuffer = this.createWaterNoiseBuffer();
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      const lowpassFilter = this.ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.setValueAtTime(520, now);
      lowpassFilter.Q.value = 1.2;

      // LFO for breathing circular water motion (0.1Hz gentle swell)
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, now);
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(140, now); // Modulates frequency between 380Hz and 660Hz

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(lowpassFilter.frequency);
      this.lfo.start(now);

      // 2. Head Spa Circular Arc Water Spray (Bandpass shimmer)
      const sprayFilter = this.ctx.createBiquadFilter();
      sprayFilter.type = 'bandpass';
      sprayFilter.frequency.setValueAtTime(1250, now);
      sprayFilter.Q.value = 1.8;

      const sprayGain = this.ctx.createGain();
      sprayGain.gain.value = 0.28;

      this.noiseSource.connect(lowpassFilter);
      lowpassFilter.connect(this.masterGain);

      this.noiseSource.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(this.masterGain);

      this.noiseSource.start(now);

      // 3. Gentle random therapeutic droplets
      this.dropletInterval = window.setInterval(() => {
        if (Math.random() > 0.4) {
          this.triggerDroplet();
        }
      }, 700);

      this.isCurrentlyPlaying = true;
      this.notifyListeners();
    } catch (e) {
      console.warn('ASMR Audio Context play was prevented:', e);
    }
  }

  public pause(): void {
    if (!this.isCurrentlyPlaying || !this.ctx || !this.masterGain) {
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
      return;
    }

    const now = this.ctx.currentTime;
    // Soft Fade-out (800ms)
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

    if (this.dropletInterval) {
      clearInterval(this.dropletInterval);
      this.dropletInterval = null;
    }

    setTimeout(() => {
      try {
        if (this.noiseSource) {
          this.noiseSource.stop();
          this.noiseSource.disconnect();
          this.noiseSource = null;
        }
        if (this.lfo) {
          this.lfo.stop();
          this.lfo.disconnect();
          this.lfo = null;
        }
      } catch {
        // Safe cleanup
      }
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
    }, 850);
  }

  public toggle(): void {
    if (this.isCurrentlyPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getAnalyserData(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.isCurrentlyPlaying) return null;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isCurrentlyPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isCurrentlyPlaying));
  }
}

export const asmrEngine = new AsmrSoundEngine();
