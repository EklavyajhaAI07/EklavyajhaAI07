import gsap from 'gsap';
import { CAMERA_GLIDE } from './master-timeline';

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
  const willChangeElements = [mark, name, role, supporting, photo, edu, stage1];
  willChangeElements.forEach(el => {
    if (el) el.style.willChange = 'opacity, transform';
  });
  tags.forEach(t => (t.style.willChange = 'opacity, transform'));

  // ── Initial states (3D depth + opacity) ─────────────────────────────────
  if (mark)       gsap.set(mark,       { opacity: 0, scale: 0.85, z: -15, transformOrigin: 'center center' });
  if (name)       gsap.set(name,       { opacity: 0, y: 16, z: 10 });
  if (role)       gsap.set(role,       { opacity: 0, y: 14, z: 5 });
  if (supporting) gsap.set(supporting, { opacity: 0, y: 10, z: 0 });
  if (tags.length) gsap.set(tags,      { opacity: 0, scale: 0.9, y: 10, z: -5 });
  if (photo)      gsap.set(photo,      { opacity: 0, scale: 0.92, x: 20, z: 15 });
  if (edu)        gsap.set(edu,        { opacity: 0, y: 10 });

  // ── Stage 1 timeline ────────────────────────────────────────────────────
  // 0.1s – Logo mark draws in with 3D depth settle
  if (mark) {
    tl.to(mark, { opacity: 1, scale: 1, z: 0, duration: 0.75, ease: CAMERA_GLIDE }, 0.1);
  }

  // 0.85s – Name masked glide
  if (name) {
    tl.to(name, { opacity: 1, y: 0, z: 0, duration: 0.7, ease: CAMERA_GLIDE }, 0.85);
  }

  // 1.5s – Role line
  if (role) {
    tl.to(role, { opacity: 1, y: 0, z: 0, duration: 0.6, ease: CAMERA_GLIDE }, 1.5);
  }

  // 2.0s – Supporting line
  if (supporting) {
    tl.to(supporting, { opacity: 1, y: 0, duration: 0.55, ease: CAMERA_GLIDE }, 2.0);
  }

  // 2.4s – Tags (single stagger tween)
  if (tags.length) {
    tl.to(tags, {
      opacity: 1, scale: 1, y: 0, z: 0,
      duration: 0.4,
      stagger: { each: 0.1, ease: 'none' },
      ease: CAMERA_GLIDE,
    }, 2.4);
  }

  // Keep the portrait visible through most of the identity chapter.
  if (photo) {
    tl.to(photo, { opacity: 1, scale: 1, x: 0, z: 0, duration: 0.85, ease: CAMERA_GLIDE }, 0.65);
  }

  // 3.3s – Education badge
  if (edu) {
    tl.to(edu, { opacity: 1, y: 0, duration: 0.5, ease: CAMERA_GLIDE }, 3.3);
  }

  // 4.4s – Overlap transition: Stage 1 smoothly recedes and cross-fades out
  tl.to(stage1, { opacity: 0, scale: 0.98, z: -35, duration: 0.55, ease: CAMERA_GLIDE }, 4.4);

  // ── Release will-change after stage finishes (4.95s) ────────────────────
  tl.call(() => {
    willChangeElements.forEach(el => { if (el) el.style.willChange = 'auto'; });
    tags.forEach(t => (t.style.willChange = 'auto'));
  }, undefined, 4.95);

  return tl;
}
