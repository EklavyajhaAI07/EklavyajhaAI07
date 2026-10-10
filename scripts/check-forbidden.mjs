import fs from 'node:fs';
import path from 'node:path';

const FORBIDDEN_RULES = [
  {
    name: 'Phone number pattern',
    regex: /(?:\+91[\s-]?)?[6789]\d{9}/,
  },
  {
    name: 'Plain-text email in shipped content/markup',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  },
  {
    name: 'Exact forbidden role "AI Engineer" (not learning AI engineering)',
    regex: /(?:role|title|roleLine|jobTitle)["':\s]+AI Engineer(?:\b|["',])/i,
  },
  {
    name: 'Rank 47 claim',
    regex: /rank\s*47|47th\s*rank|rank:\s*47/i,
  },
  {
    name: 'Forbidden messaging channels (WhatsApp/Telegram)',
    regex: /\b(whatsapp|telegram)\b/i,
  },
];

const SCAN_DIRS = ['src', 'public', 'content', 'dist/client'];

function scanFile(filePath, errors) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  // Skip markdown docs in content folder (like content-schema.md) - only scan content JSONs
  if (relPath.startsWith('content/') && !relPath.endsWith('.json')) {
    return;
  }

  // Skip binary/image files
  if (/\.(png|jpe?g|webp|gif|ico|pdf|woff2?|ttf|eot)$/i.test(filePath)) {
    return;
  }

  for (const rule of FORBIDDEN_RULES) {
    if (rule.regex.test(content)) {
      errors.push(`[VIOLATION] Rule "${rule.name}" triggered in: ${relPath}`);
    }
  }
}

function scanDirRecursive(dirPath, errors) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDirRecursive(fullPath, errors);
    } else if (entry.isFile()) {
      scanFile(fullPath, errors);
    }
  }
}

const errors = [];
for (const dir of SCAN_DIRS) {
  scanDirRecursive(path.join(process.cwd(), dir), errors);
}

if (errors.length > 0) {
  console.error('\n❌ Forbidden content violations detected:');
  errors.forEach((err) => console.error(err));
  process.exit(1);
} else {
  console.log('✅ All forbidden content checks passed! Zero violations.');
  process.exit(0);
}
