import gsap from 'gsap';

export function createProofStageTimeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const stage2     = container.querySelector<HTMLElement>('#anim-stage-2');
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
  statCards.forEach(c => (c.style.willChange = 'opacity, transform'));
  projectCards.forEach(c => (c.style.willChange = 'opacity, transform'));
  techPills.forEach(p => (p.style.willChange = 'opacity, transform'));

  // ── Initial states ────────────────────────────────────────────────────────
  // Use visibility trick instead of display:none toggling to avoid reflow:
  // Stage wrapper: hidden via opacity, actual display managed at boundaries only.
  gsap.set(stage2, { opacity: 0, visibility: 'hidden', display: 'flex' });

  statCards.forEach(c => gsap.set(c, { opacity: 0, y: 18, scale: 0.95 }));
  projectCards.forEach(c => gsap.set(c, { opacity: 0, x: 36 }));
  if (archDiagram) gsap.set(archDiagram, { opacity: 0, scale: 0.95 });
  techPills.forEach(p => gsap.set(p, { opacity: 0, y: 12, scale: 0.9 }));

  // ── 5.0s: Stage 2 becomes visible ────────────────────────────────────────
  tl.set(stage2, { visibility: 'visible' }, 4.95);
  tl.to(stage2, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 4.95);

  // ── 5.2 – 7.4s: Stat cards enter as a single staggered tween ─────────────
  if (statCards.length) {
    tl.to(statCards, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.45,
      stagger: { each: 0.18, ease: 'none' },
      ease: 'back.out(1.2)',
    }, 5.2);

    // Number counters — one tween per card, but using pre-read target values
    // so there are no DOM reads inside onUpdate (only writes).
    statCards.forEach((card, index) => {
      const valEl = card.querySelector<HTMLElement>('.stat-number');
      if (!valEl) return;

      // Pre-read target before timeline runs (no reflow inside onUpdate)
      const rawTarget = parseFloat(valEl.dataset.target ?? '0');
      const isLarge   = rawTarget >= 1000;
      const proxy     = { val: 0 };
      const startTime = 5.3 + index * 0.18;

      tl.to(proxy, {
        val: rawTarget,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate() {
          // Only DOM write — no reads
          valEl.textContent = isLarge
            ? Math.round(proxy.val).toLocaleString()
            : Math.round(proxy.val).toString();
        },
      }, startTime);
    });
  }

  // ── 7.6s: Stat cards exit ─────────────────────────────────────────────────
  if (statCards.length) {
    tl.to(statCards, {
      opacity: 0, y: -14,
      duration: 0.35, ease: 'power2.in',
    }, 7.6);
  }

  // ── 8.0 – 12.8s: Featured project slides (one at a time) ─────────────────
  if (projectCards.length > 0) {
    const window = 4.8;
    const timePerProject = Math.min(2.2, window / projectCards.length);

    projectCards.forEach((card, i) => {
      const enterAt  = 8.0 + i * timePerProject;
      const exitAt   = enterAt + timePerProject - 0.3;

      tl.to(card, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, enterAt);
      tl.to(card, { opacity: 0, x: -36, duration: 0.3, ease: 'power2.in' }, exitAt);
    });
  }

  // ── Architecture diagram (Teams page) ────────────────────────────────────
  if (archDiagram) {
    tl.to(archDiagram, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, 8.2);

    // Pre-cached path lengths → no reflow here
    archPaths.forEach((p, idx) => {
      tl.to(p, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      }, 8.5 + idx * 0.18);
    });

    const nodes = archDiagram.querySelectorAll<HTMLElement>('.arch-node');
    nodes.forEach((n, idx) => {
      n.style.willChange = 'opacity, transform';
      tl.fromTo(n,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)' },
        8.6 + idx * 0.22
      );
    });

    tl.to(archDiagram, { opacity: 0, y: -14, duration: 0.35, ease: 'power2.in' }, 12.4);
  }

  // ── 12.8 – 14.2s: Tech pills assemble then exit ───────────────────────────
  if (techPills.length) {
    tl.to(techPills, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.35,
      stagger: { each: 0.07, ease: 'none' },
      ease: 'back.out(1.3)',
    }, 12.8);

    tl.to(techPills, {
      opacity: 0, y: -12,
      duration: 0.3,
      stagger: { each: 0.04, ease: 'none' },
      ease: 'power2.in',
    }, 14.2);
  }

  // ── 14.5 – 15.0s: Fade out Stage 2 ──────────────────────────────────────
  tl.to(stage2, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 14.5);
  tl.set(stage2, { visibility: 'hidden' }, 14.85);

  // Release GPU hints
  tl.call(() => {
    statCards.forEach(c => (c.style.willChange = 'auto'));
    projectCards.forEach(c => (c.style.willChange = 'auto'));
    techPills.forEach(p => (p.style.willChange = 'auto'));
  }, undefined, 14.9);

  return tl;
}
