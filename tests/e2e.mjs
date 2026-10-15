/** Native Chromium DevTools Protocol E2E — zero npm dependencies.
 * Run: npm run test:e2e. Captures desktop/mobile screenshots and real browser assertions.
 */
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {setTimeout as sleep} from 'node:timers/promises';
import assert from 'node:assert/strict';
const chromium=process.env.CHROME_BIN||['/usr/bin/chromium','/usr/bin/google-chrome','/usr/bin/google-chrome-stable'].find(p=>{try{execFileSync('test',['-x',p]);return true;}catch{return false;}});
if(!chromium){console.error('SKIP E2E: Chromium binary unavailable');process.exit(0);}
const port=42187,debug=42188;
const site=spawn(process.execPath,['scripts/serve.mjs','--port',String(port)],{stdio:['ignore','pipe','pipe']});
const browser=spawn(chromium,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--disable-background-networking','--no-proxy-server','--proxy-bypass-list=*','--no-first-run','--no-default-browser-check','--remote-allow-origins=*',`--remote-debugging-port=${debug}`,'--window-size=1440,900','about:blank'],{stdio:'ignore'});
function stop(){try{browser.kill('SIGKILL');}catch{}try{site.kill('SIGKILL');}catch{}}
async function getJSON(url){const r=await fetch(url);if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();}
async function ready(fn,timeout=10000){const start=Date.now();while(Date.now()-start<timeout){try{const x=await fn();if(x)return x;}catch{}await sleep(180);}throw Error('E2E setup timeout');}
try{
 await ready(async()=>{const r=await fetch(`http://127.0.0.1:${port}/me/`);return r.ok;});
 const tab=await ready(async()=>{const tabs=await getJSON(`http://127.0.0.1:${debug}/json`);return tabs.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);});
 const socket=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((ok,fail)=>{socket.addEventListener('open',ok,{once:true});socket.addEventListener('error',fail,{once:true});});
 let counter=0;const waiting=new Map(),exceptions=[];
 socket.addEventListener('message',event=>{const msg=JSON.parse(event.data);if(msg.id){const p=waiting.get(msg.id);if(p){waiting.delete(msg.id);if(msg.error)p.reject(Error(msg.error.message));else p.resolve(msg.result);}}if(msg.method==='Runtime.exceptionThrown'){const data=msg.params.exceptionDetails;exceptions.push(data.text+': '+(data.exception?.description||''));}});
 function send(method,params={}){return new Promise((resolve,reject)=>{const id=++counter;waiting.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(waiting.has(id)){waiting.delete(id);reject(Error('CDP command timeout '+method));}},9000).unref?.();});}
 async function evalJs(expression){const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result?.value;}
 await send('Page.enable');await send('Runtime.enable');
 const url=`http://127.0.0.1:${port}/me/`;
 await send('Page.navigate',{url});await sleep(500);if(await evalJs(`document.body?.className==='neterror'`))throw Error('Chromium navigation is blocked by organizational URLBlocklist policy in this environment; run on an unrestricted CI runner.');await ready(()=>evalJs(`document.readyState==='complete' && !!document.querySelector('#packet-play') && document.querySelector('#packet-nodes').children.length===6`));
 assert.equal(await evalJs(`document.querySelectorAll('main section.chapter').length`),8);
 assert.equal(await evalJs(`document.querySelector('#quality').options.length`),3);
 assert.equal(await evalJs(`document.querySelectorAll('#project-selector button').length`),6);
 console.log('PASS desktop: eight chapters, three quality modes, six projects');
 await evalJs(`document.querySelector('#packet-step').click()`);
 assert.match(await evalJs(`document.querySelector('#packet-detail').textContent`),/WEBSOCKET/);
 await evalJs(`document.querySelector('#packet-reset').click()`);
 assert.match(await evalJs(`document.querySelector('#packet-detail').textContent`),/CLIENT/);
 await evalJs(`document.querySelector('#pipeline-step').click()`);
 assert.match(await evalJs(`document.querySelector('#pipeline-detail').textContent`),/VERIFY/);
 await evalJs(`document.querySelector('[data-bench=infra]').click()`);
 assert.match(await evalJs(`document.querySelector('#bench-info').textContent`),/GitHub Actions/);
 await evalJs(`document.querySelector('#warehouse-move').click()`);
 assert.match(await evalJs(`document.querySelector('#warehouse-status').textContent`),/STOCK/);
 console.log('PASS interactions: packet, pipeline, workshop, warehouse');
 await evalJs(`document.querySelector('[data-project="phonepulse"]').click()`);
 assert.match(await evalJs(`document.querySelector('#case-study').textContent`),/Android Java/);
 assert.match(await evalJs(`location.href`),/project=phonepulse/);
 await send('Page.navigate',{url:`${url}?project=api-phonepulse#projects`});
 await ready(()=>evalJs(`document.querySelector('#case-study')?.textContent.includes('PhonePulse API')`));
 console.log('PASS direct deep link: project case study on reload');
 await evalJs(`document.querySelector('#terminal-input').value='<script>alert(1)</script>';document.querySelector('#terminal-form').requestSubmit()`);
 assert.match(await evalJs(`document.querySelector('#terminal-output').textContent`),/Không có lệnh/);
 assert.equal(await evalJs(`document.querySelector('#terminal-output script')===null`),true);
 await evalJs(`document.querySelector('#command-open').click()`);
 assert.equal(await evalJs(`document.querySelector('#command-dialog').open`),true);
 await evalJs(`document.querySelector('#command-close').click()`);
 assert.equal(await evalJs(`document.querySelector('#command-dialog').open`),false);
 console.log('PASS safe terminal & command dialog');
 await evalJs(`document.querySelector('#quality').value='lite';document.querySelector('#quality').dispatchEvent(new Event('change'))`);
 assert.equal(await evalJs(`document.body.classList.contains('mode-lite')`),true);
 await evalJs(`document.querySelector('#quality').value='cinema';document.querySelector('#quality').dispatchEvent(new Event('change'))`);
 assert.equal(await evalJs(`document.body.classList.contains('mode-cinema')`),true);
 await mkdir('screenshots',{recursive:true});
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await evalJs(`document.querySelector('#arrival').scrollIntoView({behavior:'instant'})`);await sleep(500);
 let img=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('screenshots/desktop.png',Buffer.from(img.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await send('Page.navigate',{url});await ready(()=>evalJs(`document.readyState==='complete' && document.querySelector('#project-selector')?.children.length===6`));
 assert.equal(await evalJs(`document.documentElement.scrollWidth <= window.innerWidth + 2`),true,'mobile horizontal overflow');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evalJs(`matchMedia('(prefers-reduced-motion: reduce)').matches`),true);
 await sleep(400);img=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('screenshots/mobile.png',Buffer.from(img.data,'base64'));
 console.log('PASS mobile: 390px viewport, no horizontal overflow, reduced-motion compatibility');
 if(exceptions.length)throw Error('Uncaught runtime exceptions: '+exceptions.join('\n'));
 console.log('PASS browser E2E: no uncaught runtime exceptions, screenshots/desktop.png, screenshots/mobile.png');
 socket.close();
}catch(error){console.error('FAIL E2E:',error.stack||error.message);process.exitCode=1;}finally{stop();}
