import gsap from 'gsap';

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

  // ── Initial states — visibility instead of display toggle ─────────────────
  gsap.set(stage4, { opacity: 0, visibility: 'hidden', display: 'flex' });
  if (endCardLine) gsap.set(endCardLine, { opacity: 0, y: 14, scale: 0.95 });
  ctaButtons.forEach(btn => gsap.set(btn, { opacity: 0, y: 14, scale: 0.9 }));
  if (actionGlow)  gsap.set(actionGlow,  { opacity: 0, scale: 0.7 });

  // ── 21.0s: Stage 4 enters ─────────────────────────────────────────────────
  tl.set(stage4, { visibility: 'visible' }, 20.95);
  tl.to(stage4, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 20.95);

  // ── 21.2s: End-card headline fades up ─────────────────────────────────────
  if (endCardLine) {
    tl.to(endCardLine, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.75, ease: 'power2.out',
    }, 21.2);
  }

  // ── 22.0s: Glow background expands ───────────────────────────────────────
  if (actionGlow) {
    tl.to(actionGlow, {
      opacity: 0.45, scale: 1,
      duration: 1.1, ease: 'power2.out',
    }, 22.0);
  }

  // ── 22.3s: CTA buttons bounce in ─────────────────────────────────────────
  if (ctaButtons.length) {
    tl.to(ctaButtons, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.45,
      stagger: { each: 0.14, ease: 'none' },
      ease: 'back.out(1.5)',
    }, 22.3);

    // Subtle breathing pulse on primary button
    const primaryBtn = stage4.querySelector<HTMLElement>('.anim-cta-primary');
    if (primaryBtn) {
      tl.to(primaryBtn, {
        scale: 1.04,
        duration: 0.75,
        repeat: 2,
        yoyo: true,
        ease: 'sine.inOut',
      }, 23.2);
    }
  }

  // ── Release GPU hints after entrance animations finish ────────────────────
  tl.call(() => {
    ctaButtons.forEach(btn => (btn.style.willChange = 'auto'));
    if (endCardLine) endCardLine.style.willChange = 'auto';
    // Keep glow will-change active since it stays visible
  }, undefined, 23.0);

  // ── 25.0s: Completion ─────────────────────────────────────────────────────
  tl.call(() => {
    if (onCompleteCallback) onCompleteCallback();
  }, undefined, 25.0);

  return tl;
}
