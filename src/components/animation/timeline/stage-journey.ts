import gsap from 'gsap';
import { CAMERA_GLIDE } from './master-timeline';

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
  stage3.style.willChange = 'opacity, transform';

  // ── Initial state (3D depth ready) ────────────────────────────────────────
  gsap.set(stage3, { opacity: 0, visibility: 'hidden', display: 'flex', scale: 1.02, z: 20 });
  nodes.forEach(n => gsap.set(n, { opacity: 0, scale: 0.88, y: 14, z: -15 }));

  // ── 14.45s: Stage 3 enters (overlapping cross-fade with Stage 2 exit) ────
  tl.set(stage3, { visibility: 'visible' }, 14.45);
  tl.to(stage3, { opacity: 1, scale: 1, z: 0, duration: 0.6, ease: CAMERA_GLIDE }, 14.45);

  // ── 15.0 – 18.5s: Spine draws across smoothly ────────────────────────────
  if (spine) {
    tl.to(spine, { strokeDashoffset: 0, duration: 3.2, ease: 'power1.inOut' }, 15.0);
  }

  // ── Nodes reveal along the spine ──────────────────────────────────────────
  const nodeCount = nodes.length;
  if (nodeCount > 0) {
    const interval = 3.2 / Math.max(nodeCount, 1);
    tl.to(nodes, {
      opacity: 1, scale: 1, y: 0, z: 0,
      duration: 0.5,
      stagger: { each: interval, ease: 'none', from: 'start' },
      ease: CAMERA_GLIDE,
    }, 15.2);
  }

  // ── 20.4s: Overlap transition: Stage 3 recedes and cross-fades out ───────
  tl.to(stage3, { opacity: 0, scale: 0.98, z: -35, duration: 0.55, ease: CAMERA_GLIDE }, 20.4);
  tl.set(stage3, { visibility: 'hidden' }, 20.95);

  // Release GPU hints
  tl.call(() => {
    nodes.forEach(n => (n.style.willChange = 'auto'));
    stage3.style.willChange = 'auto';
  }, undefined, 20.95);

  return tl;
}
