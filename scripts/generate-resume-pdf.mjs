// Pure Node.js Standards-Compliant PDF 1.4 Generator
// Generates Eklavya Jha's exact professional 1-page resume with selectable text

import fs from 'fs';
import path from 'path';

class PDFBuilder {
  constructor() {
    this.pages = [];
    this.currentPage = [];
  }

  escapeText(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/–/g, '-')
      .replace(/—/g, '-')
      .replace(/•/g, '-')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/’/g, "'");
  }

  addText(text, x, y, size = 10, font = 'F1', r = 0, g = 0, b = 0) {
    const escaped = this.escapeText(text);
    this.currentPage.push(
      `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escaped}) Tj ET`
    );
  }

  // Estimate text width in points for standard Helvetica
  getTextWidth(text, size = 10, font = 'F1') {
    // Average character width factor: ~0.55 for regular, ~0.60 for bold
    const factor = font === 'F2' ? 0.58 : 0.52;
    return text.length * size * factor;
  }

  addTextCentered(text, y, size = 10, font = 'F1', r = 0, g = 0, b = 0, pageWidth = 595.28) {
    const width = this.getTextWidth(text, size, font);
    const x = Math.max(30, (pageWidth - width) / 2);
    this.addText(text, x, y, size, font, r, g, b);
  }

  addTextRightAligned(text, rightX, y, size = 10, font = 'F1', r = 0, g = 0, b = 0) {
    const width = this.getTextWidth(text, size, font);
    const x = rightX - width;
    this.addText(text, x, y, size, font, r, g, b);
  }

  addLine(x1, y1, x2, y2, lineWidth = 0.75, r = 0.2, g = 0.2, b = 0.2) {
    this.currentPage.push(
      `${lineWidth} w ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`
    );
  }

  // Word wrap helper
  wrapText(text, maxWidth, size = 9, font = 'F1') {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.getTextWidth(testLine, size, font);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  build() {
    if (this.currentPage.length > 0) {
      this.pages.push(this.currentPage);
    }

    const catalogIdx = 1;
    const pagesIdx = 2;
    const fontRegularIdx = 3;
    const fontBoldIdx = 4;
    const fontItalicIdx = 5;

    let nextIdx = 6;
    const pageObjIndices = [];
    const contentObjIndices = [];

    for (let i = 0; i < this.pages.length; i++) {
      pageObjIndices.push(nextIdx++);
      contentObjIndices.push(nextIdx++);
    }

    let pdf = `%PDF-1.4\n%âãÏÓ\n`;
    const offsets = [];

    function addObj(str) {
      offsets.push(pdf.length);
      pdf += `${offsets.length} 0 obj\n${str}\nendobj\n`;
    }

    // Catalog & Pages
    addObj(`<< /Type /Catalog /Pages ${pagesIdx} 0 R >>`);
    const kidsStr = pageObjIndices.map(idx => `${idx} 0 R`).join(' ');
    addObj(`<< /Type /Pages /Kids [${kidsStr}] /Count ${this.pages.length} >>`);

    // Standard Fonts
    addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
    addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);
    addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>`);

    // Pages & Contents
    for (let i = 0; i < this.pages.length; i++) {
      const content = this.pages[i].join('\n');
      const streamLen = Buffer.byteLength(content, 'utf8');

      addObj(
        `<< /Type /Page /Parent ${pagesIdx} 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentObjIndices[i]} 0 R /Resources << /Font << /F1 ${fontRegularIdx} 0 R /F2 ${fontBoldIdx} 0 R /F3 ${fontItalicIdx} 0 R >> >> >>`
      );

      addObj(
        `<< /Length ${streamLen} >>\nstream\n${content}\nendstream`
      );
    }

    // XRef table
    const startXref = pdf.length;
    pdf += `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets) {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${offsets.length + 1} /Root ${catalogIdx} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

    return Buffer.from(pdf, 'utf8');
  }
}

// Generate Resume Content
const doc = new PDFBuilder();
const pageWidth = 595.28;
const margin = 36;
const contentWidth = pageWidth - margin * 2;
const rightEdge = pageWidth - margin;
let y = 808;

// ── HEADER (Centered) ───────────────────────────────────────────────────
doc.addTextCentered('Eklavya Jha', y, 20, 'F2', 0.08, 0.20, 0.45);
y -= 14;

const contactLine = '+91 7778039191  |  eklavyaprivate22@gmail.com  |  Portfolio  |  LinkedIn  |  GitHub  |  X  |  Reddit';
doc.addTextCentered(contactLine, y, 8.5, 'F1', 0.15, 0.18, 0.22);
y -= 14;

// Helper: Section Heading with Underline
function drawSection(title) {
  doc.addText(title, margin, y, 10.5, 'F2', 0.08, 0.20, 0.45);
  y -= 3;
  doc.addLine(margin, y, rightEdge, y, 0.75, 0.65, 0.70, 0.78);
  y -= 9;
}

// ── PROFESSIONAL SUMMARY ─────────────────────────────────────────────────
drawSection('Professional Summary');
const summaryText = 'Full Stack Developer with 2+ years of hands-on project experience in modern web development. Skilled in Python, SQL, JavaScript, TypeScript, React, HTML, and CSS, with strong expertise in frontend engineering, UI/UX, and AI-powered applications. Actively developing expertise in AI, Machine Learning, and Data Science.';
const summaryLines = doc.wrapText(summaryText, contentWidth, 8.5, 'F1');
for (const line of summaryLines) {
  doc.addText(line, margin, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  y -= 10.5;
}
y -= 4;

// ── TECHNICAL SKILLS ─────────────────────────────────────────────────────
drawSection('Technical Skills');
const skills = [
  { label: 'Languages & Core:', value: 'Python, TypeScript, JavaScript, HTML, CSS, SQL' },
  { label: 'Frameworks & Libraries:', value: 'React, Node.js, Express.js' },
  { label: 'AI & Machine Learning:', value: 'Agentic AI (CrewAI), Prompt Engineering, Data Analytics' },
  { label: 'Cloud & Databases:', value: 'Supabase, MongoDB, Vercel, Render, Railway' },
  { label: 'Tools & Methodologies:', value: 'GitHub, REST APIs, API Integration, Version Control, UI/UX Design' },
];

for (const skill of skills) {
  doc.addText(skill.label, margin, y, 8.5, 'F2', 0.12, 0.14, 0.18);
  doc.addText(skill.value, margin + 125, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  y -= 10.5;
}
y -= 4;

// ── EXPERIENCE ───────────────────────────────────────────────────────────
drawSection('Experience');

// Job 1
doc.addText('Independent Software Consulting', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addTextRightAligned('Feb 2026 - Present', rightEdge, y, 8.5, 'F2', 0.12, 0.14, 0.18);
y -= 10;
doc.addText('Full Stack Developer', margin, y, 8.5, 'F3', 0.20, 0.25, 0.32);
doc.addTextRightAligned('Remote', rightEdge, y, 8.5, 'F3', 0.35, 0.40, 0.48);
y -= 10;

const exp1Bullets = [
  'Architected and developed a fully responsive institutional website for Eklavya Group Tuition, ensuring seamless performance across desktop, tablet, and mobile devices.',
  'Designed intuitive UI/UX to improve student and parent engagement while enhancing accessibility and navigation.',
  'Managed the complete development lifecycle, including planning, development, testing, deployment, and ongoing maintenance.',
];

for (const b of exp1Bullets) {
  doc.addText('-', margin + 4, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  const lines = doc.wrapText(b, contentWidth - 14, 8.5, 'F1');
  for (let i = 0; i < lines.length; i++) {
    doc.addText(lines[i], margin + 12, y, 8.5, 'F1', 0.12, 0.14, 0.18);
    y -= 9.5;
  }
}
y -= 3;

// Job 2
doc.addText('National & International Hackathons', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addTextRightAligned('Dec 2025 - Present', rightEdge, y, 8.5, 'F2', 0.12, 0.14, 0.18);
y -= 10;
doc.addText('Team Leader & Core Builder', margin, y, 8.5, 'F3', 0.20, 0.25, 0.32);
doc.addTextRightAligned('Remote / On-site', rightEdge, y, 8.5, 'F3', 0.35, 0.40, 0.48);
y -= 10;

const exp2Bullets = [
  'Led technical architecture, cross-functional task delegation, and rapid prototyping across 13+ national-level hackathons, directing end-to-end design and feature engineering.',
  'Structured technical onboarding for team members covering version control and cloud deployment pipelines to ensure immediate production readiness under pressure.',
];

for (const b of exp2Bullets) {
  doc.addText('-', margin + 4, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  const lines = doc.wrapText(b, contentWidth - 14, 8.5, 'F1');
  for (let i = 0; i < lines.length; i++) {
    doc.addText(lines[i], margin + 12, y, 8.5, 'F1', 0.12, 0.14, 0.18);
    y -= 9.5;
  }
}
y -= 4;

// ── PROJECTS ─────────────────────────────────────────────────────────────
drawSection('Projects');

// Project 1
doc.addText('ProofDesk AI', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addText('| React, Python, GenAI APIs, Supabase, Vercel', margin + 74, y, 8.5, 'F3', 0.25, 0.30, 0.38);
doc.addTextRightAligned('Live Link', rightEdge, y, 8.5, 'F1', 0.15, 0.35, 0.75);
y -= 10;

const proj1Bullets = [
  'Built a full-stack AI document analysis platform delivering semantic search, summarization, and contextual Q&A, using React, Python, and GenAI APIs, with Supabase for storage/auth and deployment on Vercel.',
  'Solved unstructured document parsing and context-retention challenges by implementing structured chunking and embedding-based retrieval, improving response accuracy.',
];
for (const b of proj1Bullets) {
  doc.addText('-', margin + 4, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  const lines = doc.wrapText(b, contentWidth - 14, 8.5, 'F1');
  for (let i = 0; i < lines.length; i++) {
    doc.addText(lines[i], margin + 12, y, 8.5, 'F1', 0.12, 0.14, 0.18);
    y -= 9.5;
  }
}
y -= 3;

// Project 2
doc.addText('Viral Content AI', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addText('| Python, CrewAI, Next.js, LLM APIs', margin + 84, y, 8.5, 'F3', 0.25, 0.30, 0.38);
doc.addTextRightAligned('GitHub Repo', rightEdge, y, 8.5, 'F1', 0.15, 0.35, 0.75);
y -= 10;

const proj2Bullets = [
  'Built a multi-agent AI workflow using CrewAI and Next.js that automates trend research and content generation via LLM APIs.',
  'Resolved multi-agent coordination and output-consistency issues by designing structured pipelines, refining prompts, and adding validation layers - prototyped to demonstrate scalable AI content automation.',
];
for (const b of proj2Bullets) {
  doc.addText('-', margin + 4, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  const lines = doc.wrapText(b, contentWidth - 14, 8.5, 'F1');
  for (let i = 0; i < lines.length; i++) {
    doc.addText(lines[i], margin + 12, y, 8.5, 'F1', 0.12, 0.14, 0.18);
    y -= 9.5;
  }
}
y -= 3;

// Project 3
doc.addText('TalkToLead', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addText('| React, Node.js, Express.js, Supabase, REST APIs', margin + 64, y, 8.5, 'F3', 0.25, 0.30, 0.38);
doc.addTextRightAligned('Live Link', rightEdge, y, 8.5, 'F1', 0.15, 0.35, 0.75);
y -= 10;

const proj3Bullets = [
  'Built an AI-powered conversational platform automating lead qualification, with a responsive dashboard for managing leads and business inquiries.',
  'Solved real-time conversation flow and lead-data accuracy challenges through optimized API response handling and structured conversation logic.',
];
for (const b of proj3Bullets) {
  doc.addText('-', margin + 4, y, 8.5, 'F1', 0.12, 0.14, 0.18);
  const lines = doc.wrapText(b, contentWidth - 14, 8.5, 'F1');
  for (let i = 0; i < lines.length; i++) {
    doc.addText(lines[i], margin + 12, y, 8.5, 'F1', 0.12, 0.14, 0.18);
    y -= 9.5;
  }
}
y -= 4;

// ── EDUCATION ────────────────────────────────────────────────────────────
drawSection('Education');

doc.addText('Gandhinagar University', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addTextRightAligned('Expected 2029', rightEdge, y, 8.5, 'F2', 0.12, 0.14, 0.18);
y -= 10;
doc.addText('Bachelor of Technology in AI', margin, y, 8.5, 'F1', 0.15, 0.18, 0.22);
y -= 11;

doc.addText('IIT Roorkee + Microsoft Joint Initiative', margin, y, 9.5, 'F2', 0.08, 0.12, 0.20);
doc.addTextRightAligned('2026 - 2027 (Currently Pursuing)', rightEdge, y, 8.5, 'F2', 0.12, 0.14, 0.18);
y -= 10;
doc.addText('Elite AI & Data Science Certification Program', margin, y, 8.5, 'F1', 0.15, 0.18, 0.22);

const pdfBuffer = doc.build();

// Write to both standard public locations
const targetDir1 = path.resolve('public', 'assets');
const targetDir2 = path.resolve('public');

if (!fs.existsSync(targetDir1)) fs.mkdirSync(targetDir1, { recursive: true });

fs.writeFileSync(path.join(targetDir1, 'eklavya-jha-resume.pdf'), pdfBuffer);
fs.writeFileSync(path.join(targetDir2, 'Eklavya-Jha-Resume.pdf'), pdfBuffer);

console.log('✅ Accurate 1-page Resume PDF generated successfully at public/assets/eklavya-jha-resume.pdf and public/Eklavya-Jha-Resume.pdf');
