import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

async function text(path) {
  return readFile(join(root, path), 'utf8');
}

function requirePattern(source, pattern, message) {
  if (!pattern.test(source)) failures.push(message);
}

const [base, controls, stage, connect, workerConfig, headers] = await Promise.all([
  text('src/layouts/Base.astro'),
  text('src/components/animation/AnimationControls.astro'),
  text('src/components/animation/AnimationStage.astro'),
  text('src/components/ConnectSection.astro'),
  text('wrangler.jsonc'),
  text('public/_headers'),
]);

const [hackathons, stats, identity, dealflow360, skills] = await Promise.all([
  text('content/hackathons.json').then(JSON.parse),
  text('content/stats.json').then(JSON.parse),
  text('content/identity.json').then(JSON.parse),
  text('content/projects/dealflow360.json').then(JSON.parse),
  text('content/skills.json').then(JSON.parse),
]);
const finalistCount = hackathons.filter((entry) => entry.result === 'finalist').length;
const finalistStat = stats.find((entry) => entry.id === `finalist-${finalistCount}x`);
if (!finalistStat || finalistStat.value !== finalistCount) {
  failures.push('Hackathon finalist stat does not match the finalist records.');
}
if (!identity.tags.includes(`${finalistCount}x Hackathon Finalist`)) {
  failures.push('Identity finalist tag does not match the finalist records.');
}
if (dealflow360.tech.length > 0 || skills.some((skill) => skill.proofProject === 'dealflow360')) {
  failures.push('Dealflow360 must not be used as evidence for unconfirmed technology claims.');
}

requirePattern(base, /google-site-verification/, 'Google verification tag is missing.');
requirePattern(base, /og:image:width/, 'Open Graph image dimensions are missing.');
requirePattern(controls, /aria-pressed/, 'Chapter controls do not expose their active state.');
requirePattern(stage, /intro_skipped/, 'Intro skip analytics are missing.');
requirePattern(stage, /resume_downloaded/, 'Animated resume CTA analytics are missing.');
requirePattern(connect, /contact_started/, 'Contact-start analytics are missing.');
requirePattern(workerConfig, /"run_worker_first"\s*:\s*\["\/api\/\*"\]/, 'Worker API routing is not configured.');

if (/\/assets\/\*[\s\S]{0,160}immutable/.test(headers)) {
  failures.push('Non-hashed public assets must not use immutable caching.');
}

for (const [path, maxBytes] of [
  ['public/assets/eklavya-photo-320.avif', 50_000],
  ['public/assets/eklavya-photo-320.webp', 50_000],
  ['public/assets/og/portfolio-card.png', 200_000],
]) {
  const { size } = await stat(join(root, path));
  if (size > maxBytes) failures.push(`${path} is ${size} bytes; budget is ${maxBytes}.`);
}

if (failures.length) {
  console.error(`Portfolio checks failed:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('Portfolio checks passed.');
}
