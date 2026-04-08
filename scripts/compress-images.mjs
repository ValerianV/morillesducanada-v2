import sharp from 'sharp';
import { readdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ORIGINALS = 'src/assets/originals';
const OUTPUT   = 'src/assets';

const RULES = [
  { match: (f, d) => d === 'morels',             quality: 70, maxWidth: 600,  label: 'morels/' },
  { match: (f)    => /^product-/.test(f),        quality: 78, maxWidth: 600,  label: 'product' },
  { match: (f)    => /^landscape-/.test(f),      quality: 75, maxWidth: 1200, label: 'landscape' },
  { match: (f)    => /^hero-/.test(f),           quality: 78, maxWidth: 1440, label: 'hero' },
  { match: (f)    => /^valerian-portrait/.test(f), quality: 78, maxWidth: 400, label: 'portrait' },
  { match: (f)    => /^logo/.test(f),            quality: 85, maxWidth: 300,  label: 'logo' },
  { match: ()     => true,                       quality: 75, maxWidth: 1000, label: 'other' },
];

function getRule(filename, subdir) {
  return RULES.find(r => r.match(filename, subdir));
}

async function findWebp(dir, subdir = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      files = files.concat(await findWebp(join(dir, e.name), e.name));
    } else if (e.isFile() && e.name.endsWith('.webp')) {
      files.push({ src: join(dir, e.name), filename: e.name, subdir });
    }
  }
  return files;
}

const originals = await findWebp(ORIGINALS);
const stats = {};

for (const { src, filename, subdir } of originals) {
  const rule = getRule(filename, subdir);
  const label = rule.label;

  const destDir = subdir ? join(OUTPUT, subdir) : OUTPUT;
  const dest = join(destDir, filename);

  const before = (await stat(src)).size;

  const buf = await sharp(src)
    .resize({ width: rule.maxWidth, withoutEnlargement: true })
    .webp({ quality: rule.quality })
    .toBuffer();

  await writeFile(dest, buf);

  const after = buf.length;
  if (!stats[label]) stats[label] = { count: 0, before: 0, after: 0 };
  stats[label].count++;
  stats[label].before += before;
  stats[label].after  += after;
}

console.log('\n=== Compression results (from originals) ===\n');
let tb = 0, ta = 0;
for (const [label, s] of Object.entries(stats)) {
  const saved = s.before - s.after;
  const pct   = ((saved / s.before) * 100).toFixed(1);
  console.log(
    `${label.padEnd(12)} ${String(s.count).padStart(3)} files | ` +
    `${(s.before/1024).toFixed(0).padStart(6)} KB → ${(s.after/1024).toFixed(0).padStart(6)} KB | ` +
    `saved ${(saved/1024).toFixed(0).padStart(5)} KB (${pct}%)`
  );
  tb += s.before; ta += s.after;
}
const saved = tb - ta;
console.log(`\n${'TOTAL'.padEnd(12)} ${String(originals.length).padStart(3)} files | ` +
  `${(tb/1024).toFixed(0).padStart(6)} KB → ${(ta/1024).toFixed(0).padStart(6)} KB | ` +
  `saved ${(saved/1024).toFixed(0).padStart(5)} KB (${((saved/tb)*100).toFixed(1)}%)`);
console.log(`\nFinal size: ${(ta/1024/1024).toFixed(2)} MB`);
