import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(resolve(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
if(new Set(ids).size!==ids.length)throw new Error('Duplicate element IDs');
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=match[1];
  if(target.startsWith('#')&&!ids.includes(target.slice(1)))throw new Error('Broken anchor: '+target);
  if(target.startsWith('./'))await access(resolve(root,target));
}
for(const file of ['assets/app.js','assets/universe.js','assets/data.js','assets/os-v2.js','scripts/serve.mjs','scripts/test-v2.mjs'])execFileSync(process.execPath,['--check',resolve(root,file)],{stdio:'inherit'});
if(/Senior Developer|Senior Software Engineer|Full-stack Expert/.test(html))throw new Error('Unsupported job title');
if(!html.includes('rel="noopener noreferrer"'))throw new Error('External links not protected');
console.log('PASS: JavaScript syntax, local assets, anchors, unique IDs and identity checks. Static site is ready.');
