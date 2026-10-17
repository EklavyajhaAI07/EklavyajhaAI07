import gsap from 'gsap';
import { CAMERA_GLIDE } from './master-timeline';

export function createProofStageTimeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const stage2 = container.querySelector<HTMLElement>('#anim-stage-2');
  if (!stage2) return tl;

  const statCards    = stage2.querySelectorAll<HTMLElement>('.anim-stat-card');
  const projectCards = stage2.querySelectorAll<HTMLElement>('.anim-project-slide');
  const archDiagram  = stage2.querySelector<HTMLElement>('.anim-arch-diagram');
  const techPills    = stage2.querySelectorAll<HTMLElement>('.anim-tool-pill');

  // ── Cache SVG path lengths before animating to avoid mid-tween reflows ──
  let archPaths: SVGPathElement[] = [];
  if (archDiagram) {
    archPaths = Array.from(archDiagram.querySelectorAll<SVGPathElement>('.arch-path'));
    archPaths.forEach(p => {
      const len = p.getTotalLength?.() ?? 200;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
  }

  // ── GPU hints for elements that will animate ─────────────────────────────
  const willChangeEls = [stage2, archDiagram, ...Array.from(statCards), ...Array.from(projectCards), ...Array.from(techPills)];
  willChangeEls.forEach(el => {
    if (el) (el as HTMLElement).style.willChange = 'opacity, transform, filter';
  });

  // ── Initial states (3D depth + blur-to-focus ready) ─────────────────────
  gsap.set(stage2, { opacity: 0, visibility: 'hidden', display: 'flex', scale: 1.02, z: 20 });
  statCards.forEach(c => gsap.set(c, { opacity: 0, y: 16, scale: 0.92, z: -15 }));
  projectCards.forEach(c => gsap.set(c, {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
    z: -35,
    pointerEvents: 'none',
  }));
  if (archDiagram) gsap.set(archDiagram, { opacity: 0, scale: 0.94, z: -20 });
  techPills.forEach(p => gsap.set(p, { opacity: 0, y: 12, scale: 0.9, z: -10 }));

  // ── 4.45s: Stage 2 enters (overlapping cross-fade with Stage 1 exit) ─────
  tl.set(stage2, { visibility: 'visible' }, 4.45);
  tl.to(stage2, { opacity: 1, scale: 1, z: 0, duration: 0.6, ease: CAMERA_GLIDE }, 4.45);

  // ── 4.9 – 7.3s: Stat cards enter with camera-glide ease ──────────────────
  if (statCards.length) {
    tl.to(statCards, {
      opacity: 1, y: 0, scale: 1, z: 0,
      duration: 0.5,
      stagger: { each: 0.16, ease: 'none' },
      ease: CAMERA_GLIDE,
    }, 4.9);

    // Number counters
    statCards.forEach((card, index) => {
      const valEl = card.querySelector<HTMLElement>('.stat-number');
      if (!valEl) return;

      const rawTarget = parseFloat(valEl.dataset.target ?? '0');
      const isLarge   = rawTarget >= 1000;
      const proxy     = { val: 0 };
      const startTime = 5.0 + index * 0.16;

      tl.to(proxy, {
        val: rawTarget,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate() {
          valEl.textContent = isLarge
            ? Math.round(proxy.val).toLocaleString()
            : Math.round(proxy.val).toString();
        },
      }, startTime);
    });
  }

  // ── 7.4s: Stat cards exit with smooth 3D recess ──────────────────────────
  if (statCards.length) {
    tl.to(statCards, {
      opacity: 0, y: -12, scale: 0.95, z: -20,
      duration: 0.45, ease: CAMERA_GLIDE,
    }, 7.4);
  }

  // ── 7.8 – 12.8s: Project Cards (Scale + Blur-to-Focus rack shot) ─────────
  // Overlapping sequence: each next card peeks in before current fully leaves
  if (projectCards.length > 0) {
    const totalProjects = projectCards.length;
    const availableWindow = 4.8;
    const step = Math.min(1.6, availableWindow / Math.max(totalProjects, 1));

    projectCards.forEach((card, i) => {
      const enterAt = 7.8 + i * step;
      const exitAt  = enterAt + step + 0.1;

      tl.call(() => {
        card.tabIndex = 0;
        card.setAttribute('aria-hidden', 'false');
      }, undefined, enterAt);

      // Blur-to-focus rack shot: 0.9 scale & blur(10px) -> 1.0 scale sharp focus
      tl.to(card, {
        opacity: 1, scale: 1.0, filter: 'blur(0px)', z: 0, pointerEvents: 'auto',
        duration: 0.65, ease: CAMERA_GLIDE,
      }, enterAt);

      // Exit: blurs and recedes gently while next card is already emerging
      tl.to(card, {
        opacity: 0, scale: 0.95, filter: 'blur(8px)', z: 25,
        duration: 0.55, ease: CAMERA_GLIDE,
      }, exitAt);

      tl.call(() => {
        card.tabIndex = -1;
        card.setAttribute('aria-hidden', 'true');
        card.style.pointerEvents = 'none';
      }, undefined, exitAt + 0.55);
    });
  }

  // ── Architecture diagram (Teams page) ────────────────────────────────────
  if (archDiagram) {
    tl.to(archDiagram, { opacity: 1, scale: 1, z: 0, duration: 0.55, ease: CAMERA_GLIDE }, 8.0);

    archPaths.forEach((p, idx) => {
      tl.to(p, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      }, 8.3 + idx * 0.18);
    });

    const nodes = archDiagram.querySelectorAll<HTMLElement>('.arch-node');
    nodes.forEach((n, idx) => {
      tl.fromTo(n,
        { opacity: 0, scale: 0.75, z: -10 },
        { opacity: 1, scale: 1, z: 0, duration: 0.35, ease: CAMERA_GLIDE },
        8.5 + idx * 0.2
      );
    });

    tl.to(archDiagram, { opacity: 0, scale: 0.96, z: -20, duration: 0.45, ease: CAMERA_GLIDE }, 12.4);
  }

  // ── 12.8 – 14.2s: Tech pills assemble with camera glide ──────────────────
  if (techPills.length) {
    tl.to(techPills, {
      opacity: 1, y: 0, scale: 1, z: 0,
      duration: 0.4,
      stagger: { each: 0.06, ease: 'none' },
      ease: CAMERA_GLIDE,
    }, 12.8);

    tl.to(techPills, {
      opacity: 0, y: -10, scale: 0.94, z: -15,
      duration: 0.35,
      stagger: { each: 0.04, ease: 'none' },
      ease: CAMERA_GLIDE,
    }, 14.1);
  }

  // ── 14.4s: Overlap transition: Stage 2 recedes and cross-fades out ───────
  tl.to(stage2, { opacity: 0, scale: 0.98, z: -35, duration: 0.55, ease: CAMERA_GLIDE }, 14.4);
  tl.set(stage2, { visibility: 'hidden' }, 14.95);

  // Release GPU hints
  tl.call(() => {
    willChangeEls.forEach(el => { if (el) (el as HTMLElement).style.willChange = 'auto'; });
  }, undefined, 14.95);

  return tl;
}
