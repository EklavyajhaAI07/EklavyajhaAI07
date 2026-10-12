import gsap from 'gsap';
import { CAMERA_GLIDE } from './master-timeline';

export function createActionStageTimeline(
  container: HTMLElement,
  onCompleteCallback?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline();

  const stage4      = container.querySelector<HTMLElement>('#anim-stage-4');
  if (!stage4) return tl;

  const endCardLine = stage4.querySelector<HTMLElement>('.anim-end-card-line');
  const ctaButtons  = stage4.querySelectorAll<HTMLElement>('.anim-action-cta');
  const actionGlow  = stage4.querySelector<HTMLElement>('.anim-action-glow');

  // ── GPU hints ─────────────────────────────────────────────────────────────
  ctaButtons.forEach(btn => (btn.style.willChange = 'opacity, transform'));
  if (endCardLine) endCardLine.style.willChange = 'opacity, transform';
  if (actionGlow)  actionGlow.style.willChange  = 'opacity, transform';
  stage4.style.willChange = 'opacity, transform';

  // ── Initial states (3D depth ready) ───────────────────────────────────────
  gsap.set(stage4, { opacity: 0, visibility: 'hidden', display: 'flex', z: 20 });
  if (endCardLine) gsap.set(endCardLine, { opacity: 0, y: 16, scale: 0.94, z: 10 });
  ctaButtons.forEach(btn => gsap.set(btn, { opacity: 0, y: 14, scale: 0.9, z: 5 }));
  if (actionGlow)  gsap.set(actionGlow,  { opacity: 0, scale: 0.7, z: -10 });

  // ── 20.45s: Stage 4 enters (overlapping cross-fade with Stage 3 exit) ────
  tl.set(stage4, { visibility: 'visible' }, 20.45);
  tl.to(stage4, { opacity: 1, scale: 1, z: 0, duration: 0.6, ease: CAMERA_GLIDE }, 20.45);

  // ── 20.8s: End-card headline glides up with forward scale settle ─────────
  if (endCardLine) {
    tl.to(endCardLine, {
      opacity: 1, y: 0, scale: 1, z: 0,
      duration: 0.8, ease: CAMERA_GLIDE,
    }, 20.8);
  }

  // ── 21.4s: Glow background expands ───────────────────────────────────────
  if (actionGlow) {
    tl.to(actionGlow, {
      opacity: 0.45, scale: 1, z: 0,
      duration: 1.1, ease: CAMERA_GLIDE,
    }, 21.4);
  }

  // ── 21.8s: CTA buttons glide in ──────────────────────────────────────────
  if (ctaButtons.length) {
    tl.to(ctaButtons, {
      opacity: 1, y: 0, scale: 1, z: 0,
      duration: 0.5,
      stagger: { each: 0.14, ease: 'none' },
      ease: CAMERA_GLIDE,
    }, 21.8);

    // Subtle breathing pulse on primary button
    const primaryBtn = stage4.querySelector<HTMLElement>('.anim-cta-primary');
    if (primaryBtn) {
      tl.to(primaryBtn, {
        scale: 1.04,
        duration: 0.75,
        repeat: 2,
        yoyo: true,
        ease: 'sine.inOut',
      }, 22.8);
    }
  }

  // ── Release GPU hints after entrance animations finish ────────────────────
  tl.call(() => {
    ctaButtons.forEach(btn => (btn.style.willChange = 'auto'));
    if (endCardLine) endCardLine.style.willChange = 'auto';
    stage4.style.willChange = 'auto';
  }, undefined, 23.0);

  // ── 25.0s: Completion ─────────────────────────────────────────────────────
  tl.call(() => {
    if (onCompleteCallback) onCompleteCallback();
  }, undefined, 25.0);

  return tl;
}
