import gsap from 'gsap';

export function createJourneyStageTimeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const stage3 = container.querySelector<HTMLElement>('#anim-stage-3');
  if (!stage3) return tl;

  const spine = stage3.querySelector<SVGPathElement>('.journey-spine-path');
  const nodes = stage3.querySelectorAll<HTMLElement>('.anim-journey-node');

  // ── Cache SVG path length before animation to avoid reflow ───────────────
  if (spine) {
    const len = spine.getTotalLength?.() ?? 600;
    gsap.set(spine, { strokeDasharray: len, strokeDashoffset: len });
  }

  // ── GPU hints ─────────────────────────────────────────────────────────────
  nodes.forEach(n => (n.style.willChange = 'opacity, transform'));

  // ── Initial state — use visibility to avoid layout thrash ─────────────────
  gsap.set(stage3, { opacity: 0, visibility: 'hidden', display: 'flex' });
  nodes.forEach(n => gsap.set(n, { opacity: 0, scale: 0.85, y: 14 }));

  // ── 15.0s: Stage 3 activates ──────────────────────────────────────────────
  tl.set(stage3, { visibility: 'visible' }, 14.95);
  tl.to(stage3, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 14.95);

  // ── 15.3 – 18.8s: Spine draws across at constant speed ───────────────────
  if (spine) {
    tl.to(spine, { strokeDashoffset: 0, duration: 3.2, ease: 'none' }, 15.3);
  }

  // ── Nodes reveal along the spine ──────────────────────────────────────────
  const nodeCount = nodes.length;
  if (nodeCount > 0) {
    const interval = 3.5 / Math.max(nodeCount, 1);
    // One stagger tween instead of N individual tweens
    tl.to(nodes, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.45,
      stagger: { each: interval, ease: 'none', from: 'start' },
      ease: 'back.out(1.4)',
    }, 15.4);
  }

  // ── 20.3 – 21.0s: Fade out Stage 3 ──────────────────────────────────────
  tl.to(stage3, { opacity: 0, y: -14, duration: 0.45, ease: 'power2.in' }, 20.3);
  tl.set(stage3, { visibility: 'hidden' }, 20.75);

  // Release GPU hints
  tl.call(() => {
    nodes.forEach(n => (n.style.willChange = 'auto'));
  }, undefined, 20.8);

  return tl;
}
