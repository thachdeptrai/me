import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(resolve(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs');
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=m[1];if(url.startsWith('#')&&!ids.includes(url.slice(1)))throw Error('Broken anchor '+url);
 if(url.startsWith('./'))await access(resolve(root,url));
}
for(const name of ['src/world.js','src/model.js','src/app.js','scripts/check.mjs','scripts/serve.mjs','tests/model.test.mjs','tests/source.test.mjs','tests/e2e.mjs']){
 execFileSync(process.execPath,['--check',resolve(root,name)],{stdio:'inherit'});
}
if(/(?:Senior Developer|Senior Software Engineer|Full.stack Expert)/i.test(html))throw Error('Unsupported career title');
if(!html.includes('href="./src/style.css"')||!html.includes('src="./src/app.js"'))throw Error('Missing new entry point');
if(!html.includes('rel="noopener noreferrer"'))throw Error('Unsafe target blank');
if(!html.includes('name="viewport"'))throw Error('Mobile viewport not present');
console.log(`PASS build: ${ids.length} unique IDs, anchors, local assets, JS syntax, metadata, identity checks.`);
console.log('Build output: repository root (static GitHub Pages /me/; no bundler).');
