import gsap from 'gsap';
import { createIdentityStageTimeline } from './stage-identity';
import { createProofStageTimeline }   from './stage-proof';
import { createJourneyStageTimeline } from './stage-journey';
import { createActionStageTimeline }  from './stage-action';
import { soundController }            from '../sound';

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
    // Each sub-timeline starts at a fixed absolute position.
    // Stage 2 now starts at 4.95 (matches identity exit at ~4.75).
    this.tl.add(createIdentityStageTimeline(this.container),  0);
    this.tl.add(createProofStageTimeline(this.container),     4.95);
    this.tl.add(createJourneyStageTimeline(this.container),   14.95);
    this.tl.add(createActionStageTimeline(this.container, () => this.handleComplete()), 20.95);

    // Audio cue markers on stage transitions
    this.tl.call(() => soundController.playWhoosh(0.12), undefined, 5.0);
    this.tl.call(() => soundController.playWhoosh(0.12), undefined, 15.0);
    this.tl.call(() => soundController.playChime(),      undefined, 21.2);
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

    sessionStorage.setItem(`eklavya_anim_seen_${this.audience}`, 'true');
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
    this.container.classList.remove('anim-completed');
    document.body.classList.remove('animation-finished');
    this.tl.restart();
    this.options.onStateChange?.('playing');
  }

  public skip(): void {
    soundController.fadeOut();
    this.tl.seek(25.0);
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
