import gsap from 'gsap';

export function createIdentityStageTimeline(container: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const mark     = container.querySelector<HTMLElement>('.anim-logo-mark');
  const name     = container.querySelector<HTMLElement>('.anim-identity-name');
  const role     = container.querySelector<HTMLElement>('.anim-identity-role');
  const supporting = container.querySelector<HTMLElement>('.anim-identity-supporting');
  const tags     = container.querySelectorAll<HTMLElement>('.anim-identity-tag');
  const photo    = container.querySelector<HTMLElement>('.anim-identity-photo');
  const edu      = container.querySelector<HTMLElement>('.anim-identity-edu');
  const stage1   = container.querySelector<HTMLElement>('#anim-stage-1');

  if (!stage1) return tl;

  // ── GPU-promotion hints (set before any animation begins) ───────────────
  // Promote elements that will animate to their own composited layer so the
  // browser doesn't have to repaint the rest of the page on every frame.
  const willChangeElements = [mark, name, role, supporting, photo, edu];
  willChangeElements.forEach(el => {
    if (el) el.style.willChange = 'opacity, transform';
  });
  tags.forEach(t => (t.style.willChange = 'opacity, transform'));

  // ── Initial states (opacity + GPU-friendly transforms only) ─────────────
  if (mark)       gsap.set(mark,       { opacity: 0, scale: 0.8, transformOrigin: 'center center' });
  if (name)       gsap.set(name,       { opacity: 0, y: 14 });
  if (role)       gsap.set(role,       { opacity: 0, y: 14 });
  if (supporting) gsap.set(supporting, { opacity: 0, y: 10 });
  if (tags.length) gsap.set(tags,      { opacity: 0, scale: 0.88, y: 10 });
  if (photo)      gsap.set(photo,      { opacity: 0, x: 22 });
  if (edu)        gsap.set(edu,        { opacity: 0, y: 10 });

  // ── Stage 1 timeline ────────────────────────────────────────────────────
  // 0.1s – Logo mark draws in
  if (mark) {
    tl.to(mark, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.1);
  }

  // 0.85s – Name
  if (name) {
    tl.to(name, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.85);
  }

  // 1.5s – Role
  if (role) {
    tl.to(role, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 1.5);
  }

  // 2.0s – Supporting line
  if (supporting) {
    tl.to(supporting, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.0);
  }

  // 2.4s – Tags (single stagger tween — much cheaper than N individual tweens)
  if (tags.length) {
    tl.to(tags, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.35,
      stagger: { each: 0.1, ease: 'none' },
      ease: 'back.out(1.4)',
    }, 2.4);
  }

  // 3.1s – Photo
  if (photo) {
    tl.to(photo, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 3.1);
  }

  // 3.3s – Education badge
  if (edu) {
    tl.to(edu, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.3);
  }

  // 4.3s – Fade out Stage 1 → smooth hand-off to Stage 2
  tl.to(stage1, { opacity: 0, y: -18, duration: 0.4, ease: 'power2.in' }, 4.3);

  // ── Release will-change after stage finishes (4.8s) ─────────────────────
  tl.call(() => {
    willChangeElements.forEach(el => { if (el) el.style.willChange = 'auto'; });
    tags.forEach(t => (t.style.willChange = 'auto'));
  }, undefined, 4.75);

  return tl;
}
