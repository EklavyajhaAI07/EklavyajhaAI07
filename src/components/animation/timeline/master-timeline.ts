import gsap from 'gsap';
import { createIdentityStageTimeline } from './stage-identity';
import { createProofStageTimeline }   from './stage-proof';
import { createJourneyStageTimeline } from './stage-journey';
import { createActionStageTimeline }  from './stage-action';
import { soundController }            from '../sound';

// Shared cinematic easing for continuous camera glide feel
export const CAMERA_GLIDE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export interface MasterTimelineOptions {
  container: HTMLElement;
  audience: 'recruiter' | 'teams' | 'clients';
  onProgress?:    (progress: number, time: number) => void;
  onStateChange?: (state: 'playing' | 'paused' | 'completed') => void;
  onStageChange?: (stage: number) => void;
}

export class MasterTimelineController {
  private tl:           gsap.core.Timeline;
  private container:    HTMLElement;
  private audience:     'recruiter' | 'teams' | 'clients';
  private isCompleted:  boolean = false;
  private lastStage:    number  = 1;
  private options:      MasterTimelineOptions;

  // Bound listener references so we can remove them in destroy()
  private _onVisibility!: () => void;
  private _onKeydown!: (e: KeyboardEvent) => void;

  // rAF token for batching progress bar updates
  private _rafToken: number = 0;
  private _lastProgress: number = -1;

  constructor(options: MasterTimelineOptions) {
    this.options   = options;
    this.container = options.container;
    this.audience  = options.audience;

    // Build master timeline (paused — we play after fonts/images load)
    this.tl = gsap.timeline({
      paused: true,
      onUpdate:   () => this.handleUpdate(),
      onComplete: () => this.handleComplete(),
    });

    this.buildTimeline();
    this.setupListeners();
  }

  private buildTimeline(): void {
    // ── Global Camera-like Movement (continuous dolly zoom & micro pan) ───
    const cameraRig = this.container.querySelector<HTMLElement>('#anim-camera-rig');
    if (cameraRig) {
      this.tl.fromTo(
        cameraRig,
        { scale: 1.0, x: 0, y: 0 },
        { scale: 1.026, x: -8, y: -5, duration: 25.0, ease: 'sine.inOut' },
        0
      );
    }

    // ── Overlapping Stage Timelines (no hard cuts) ────────────────────────
    // Stage 1: 0.0s – 4.95s (exit begins at 4.4s)
    // Stage 2: 4.45s – 14.95s (enters while Stage 1 exits, exit begins at 14.4s)
    // Stage 3: 14.45s – 20.95s (enters while Stage 2 exits, exit begins at 20.4s)
    // Stage 4: 20.45s – 25.0s (enters while Stage 3 exits)
    // Each child timeline is authored against the shared 0–25s clock, so they
    // all mount at zero. Offsetting them here would apply each cue twice.
    this.tl.add(createIdentityStageTimeline(this.container), 0);
    this.tl.add(createProofStageTimeline(this.container), 0);
    this.tl.add(createJourneyStageTimeline(this.container), 0);
    this.tl.add(createActionStageTimeline(this.container, () => this.handleComplete()), 0);

    // Audio cue markers on stage transitions
    this.tl.call(() => soundController.playWhoosh(0.12), undefined, 4.8);
    this.tl.call(() => soundController.playWhoosh(0.12), undefined, 14.8);
    this.tl.call(() => soundController.playChime(),      undefined, 20.8);
  }

  private setupListeners(): void {
    // ── Visibility change: pause when tab hidden ───────────────────────────
    this._onVisibility = () => {
      if (document.hidden && this.tl.isActive()) {
        this.tl.pause();
        this.options.onStateChange?.('paused');
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);

    // ── Keyboard: Space toggles play/pause ────────────────────────────────
    this._onKeydown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        (e.target === document.body || this.container.contains(e.target as Node))
      ) {
        e.preventDefault();
        this.togglePlayPause();
      }
    };
    window.addEventListener('keydown', this._onKeydown);
  }

  private handleUpdate(): void {
    const time     = this.tl.time();
    const progress = this.tl.progress();

    // Batch progress-bar writes into a single rAF per frame — avoids
    // forced synchronous style recalcs if onUpdate fires mid-paint.
    const p = progress;
    if (Math.abs(p - this._lastProgress) > 0.001) {
      this._lastProgress = p;
      cancelAnimationFrame(this._rafToken);
      this._rafToken = requestAnimationFrame(() => {
        this.options.onProgress?.(p, time);
      });
    }

    // Stage tracking (cheap integer comparison, no DOM access)
    let currentStage = 1;
    if      (time >= 21.0) currentStage = 4;
    else if (time >= 15.0) currentStage = 3;
    else if (time >= 5.0)  currentStage = 2;

    if (currentStage !== this.lastStage) {
      this.lastStage = currentStage;
      this.options.onStageChange?.(currentStage);
    }
  }

  private handleComplete(): void {
    if (this.isCompleted) return; // Guard against double-fire
    this.isCompleted = true;

    sessionStorage.setItem('eklavya_intro_seen', 'true');
    this.options.onStateChange?.('completed');
    this.revealPageContent();
  }

  public revealPageContent(): void {
    this.container.classList.add('anim-completed');
    document.body.classList.add('animation-finished');
    window.dispatchEvent(
      new CustomEvent('eklavya:anim-completed', { detail: { audience: this.audience } })
    );
  }

  // ── Public API ────────────────────────────────────────────────────────────

  public play(): void {
    this.tl.play();
    this.options.onStateChange?.('playing');
  }

  public pause(): void {
    this.tl.pause();
    this.options.onStateChange?.('paused');
  }

  public togglePlayPause(): void {
    this.tl.paused() ? this.play() : this.pause();
  }

  public seek(t: number): void {
    this.tl.seek(t);
  }

  public restart(): void {
    this.isCompleted = false;
    this._lastProgress = -1;
    this.lastStage = 1;
    this.options.onStageChange?.(1);
    this.container.classList.remove('anim-completed');
    document.body.classList.remove('animation-finished');
    this.tl.restart();
    this.options.onStateChange?.('playing');
  }

  public skip(): void {
    soundController.fadeOut();
    // Jump to the resolved end-state without firing nested callbacks first;
    // handleComplete remains the single completion path for UI and hand-off.
    this.tl.pause(25.0, true);
    this.lastStage = 4;
    this.options.onStageChange?.(4);
    this.handleComplete();
  }

  public progress(value?: number): number {
    if (value !== undefined) this.tl.progress(value);
    return this.tl.progress();
  }

  public isPlaying(): boolean {
    return this.tl.isActive();
  }

  public getIsCompleted(): boolean {
    return this.isCompleted;
  }

  /** Call on page teardown / SPA navigation to prevent listener leaks. */
  public destroy(): void {
    cancelAnimationFrame(this._rafToken);
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener('keydown', this._onKeydown);
    this.tl.kill();
  }
}
