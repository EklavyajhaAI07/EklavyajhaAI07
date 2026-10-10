// Procedural Web Audio API sound generator for portfolio intro animation
// Zero external audio files, 100% synthesized, muted by default

class AnimationSoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  constructor() {
    // Check saved preference from session
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('eklavya_anim_sound');
      this.isMuted = saved !== 'true'; // Default is muted (true)
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('eklavya_anim_sound', (!this.isMuted).toString());
    }
    if (!this.isMuted) {
      this.initContext();
      this.playWhoosh(0.1); // Small feedback chirp
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('eklavya_anim_sound', (!muted).toString());
    }
  }

  // Soft low-end rhythmic beat (e.g. for card entrance or pulse)
  public playBeat(freq = 110, duration = 0.15): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  // Soft whoosh on stage transitions
  public playWhoosh(volume = 0.12): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const duration = 0.35;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  // Light harmonic chime for final CTA stage
  public playChime(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch {
      // AudioContext policy catch
    }
  }

  public fadeOut(): void {
    if (this.ctx && this.ctx.state === 'running') {
      try {
        // Softly drop volume
      } catch {
        // Safe catch
      }
    }
  }
}

export const soundController = new AnimationSoundController();
