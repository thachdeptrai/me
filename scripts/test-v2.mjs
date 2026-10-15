import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const base=new URL('../',import.meta.url);
const source=async path=>readFile(new URL(path,base),'utf8');
const [html,css,js,oldJs]=await Promise.all([
  source('index.html'),source('assets/os-v2.css'),source('assets/os-v2.js'),source('assets/app.js')
]);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'No duplicate HTML IDs');
const required=['os-mode','os-palette','os-palette-open','os-palette-search','os-palette-close',
  'os-chapter-progress','os-chapter-counter','os-engineering','os-packet-play','os-packet-step',
  'os-packet-reset','os-packet-state','os-packet-speed','os-architecture-detail',
  'os-terminal-form','os-terminal-input','os-terminal-output','os-pipeline','os-pipeline-play',
  'os-pipeline-step','os-pipeline-reset','os-pipeline-description','os-map-title'];
required.forEach(id=>assert.ok(ids.includes(id),'Missing V2 hook: '+id));
for(const match of html.matchAll(/href="#([^"]+)"/g)){
  assert.ok(ids.includes(match[1]),'Broken internal link #'+match[1]);
}
for(const target of ['assets/os-v2.css','assets/os-v2.js','assets/app.js']){
  assert.ok(html.includes('./'+target),'Asset missing from HTML: '+target);
}
for(const imported of ['assets/universe.js','assets/data.js']){
  await source(imported); // loaded by app.js rather than directly in index.html
}
assert.equal((html.match(/data-os-packet="/g)||[]).length,5,'Packet nodes');
assert.equal((html.match(/data-os-arch="/g)||[]).length,6,'Architecture nodes');
assert.equal((html.match(/data-os-pipeline="/g)||[]).length,6,'Build steps');
assert.equal((html.match(/data-share-project="/g)||[]).length,4,'Share links for four verified cases');
assert.equal((html.match(/class="project-panel"/g)||[]).length,4,'Keep original project panels');
assert.equal((html.match(/data-field="/g)||[]).length,8,'Keep original interactive 3D domains');
assert.equal((html.match(/data-step="/g)||[]).length,9,'Keep original network demo');
assert.match(html,/<dialog id="os-palette"/,'Native accessible command palette');
assert.match(html,/id="os-terminal-form"/,'Terminal is an actual form');
assert.match(html,/SIMULATION/,'State simulation plainly');
assert.match(js,/osPacketStop\(/,'Pause and reset packet timers');
assert.match(js,/osPipelineStop\(/,'Pause pipeline timers');
assert.match(js,/localStorage/,'Persist experience preferences');
assert.match(js,/textContent/,'Safe text rendering');
assert.doesNotMatch(js,/\beval\s*\(/,'No arbitrary eval');
assert.doesNotMatch(js,/new Function\s*\(/,'No arbitrary code execution');
assert.match(css,/@media\(max-width:550px\)/,'Mobile utility layout');
assert.match(css, /@media\(prefers-reduced-motion:reduce\)/,'Reduced motion support');
assert.match(oldJs,/createUniverse/,'Original interactive WebGL preserved');
for(const id of ['contact','about','work','github','systems','journey','labs']) {
  assert.ok(ids.includes(id),'Legacy navigation preserved: '+id);
}
for(const url of ['mailto:ngocthachgenz@gmail.com','tel:+84867487105'])assert.ok(html.includes(url),'Contact route '+url);
console.log('PASS: 24 V2 hooks, lab modules, internal links, progressive enhancement and regression invariants.');
