import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const baseline = JSON.parse(execFileSync('git', ['show', 'origin/main:src/data/realisations.json'], { encoding: 'utf8' }));
assert.deepEqual(json('src/data/realisations.json'), baseline, 'All project photos, order and covers must be preserved');
const project = baseline.projects.find(p => p.slug === 'yh2-maison-aube');
for (const lang of ['fr', 'en']) {
  const messages = json(`src/messages/${lang}.json`).maisonAube;
  for (const image of project.images) {
    assert(messages.imageAlts[image.src.split('/').pop().replace('.webp', '')], `Missing ${lang} alt for ${image.src}`);
    assert(fs.existsSync(`public${image.src}`));
  }
  assert(messages.attribution.includes('YH2'));
  assert(messages.attribution.includes('La Fab’ric'));
}
const oldStudies = JSON.parse(execFileSync('git', ['show', 'origin/main:src/data/project-studies.json'], { encoding: 'utf8' }));
const studies = json('src/data/project-studies.json');
for (const slug of Object.keys(oldStudies)) if (slug !== 'yh2-maison-aube') assert.deepEqual(studies[slug], oldStudies[slug]);
for (const file of ['src/data/promo-video.json', 'src/data/hero-video.json', 'src/components/sections/PromoVideoCard.tsx']) {
  assert.equal(read(file), execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' }));
}
assert(read('src/lib/project-videos.ts').includes('= {};'));
assert(read('src/components/realisations/ProjectVideo.tsx').includes('preload="none"'));
assert(read('src/app/[locale]/realisations/[slug]/page.tsx').includes('https://www.youtube.com/watch?v=egzuchDIRKs'));
console.log('PASS: existing galleries, other studies, hero and Marie-Mai preserved; bilingual image descriptions complete; future video inactive; interview linked.');
