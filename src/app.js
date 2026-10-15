import {createWorld} from './world.js';
import {CHAPTERS,PACKET,PIPELINE,ARCHITECTURE,BENCH,PROJECTS,REALITIES,terminalResult,validProject,nextIndex,projectHref} from './model.js';

const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
function el(tag,{className,text,attrs={}}={}){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));return node;}
function addText(parent,tag,text,className){const n=el(tag,{text,className});parent.append(n);return n;}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const canvas=$('#world-canvas');
const world=createWorld(canvas,{onFallback:()=>{$('#webgl-note').hidden=false;document.body.classList.add('mode-lite');}});
const modes=['cinema','balanced','lite'];
const modeControl=$('#quality');
let stored=null;try{stored=localStorage.getItem('thach-os-reborn-quality');}catch{}
const initial=modes.includes(stored)?stored:reduced.matches?'lite':(window.innerWidth<=700?'balanced':'cinema');
function setQuality(q){const mode=modes.includes(q)?q:'balanced';modeControl.value=mode;document.body.classList.remove(...modes.map(x=>'mode-'+x));document.body.classList.add('mode-'+mode);world.setQuality(mode);try{localStorage.setItem('thach-os-reborn-quality',mode);}catch{}}
modeControl.addEventListener('change',()=>setQuality(modeControl.value));setQuality(world.supported?initial:'lite');

const chapterSections=CHAPTERS.map(c=>$('#'+c.id));let activeChapter='arrival',scrollTick=false;
function onProgress(){scrollTick=false;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);$('#progress').style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`;const focus=innerHeight*.52;let nearest=0,min=Infinity;chapterSections.forEach((section,i)=>{const box=section.getBoundingClientRect();let dist=box.top<=focus&&box.bottom>=focus?0:Math.min(Math.abs(box.top-focus),Math.abs(box.bottom-focus));if(dist<min){min=dist;nearest=i;}});const item=CHAPTERS[nearest];if(item.id!==activeChapter){activeChapter=item.id;world.setScene(item.scene);}$$('[data-nav]').forEach(a=>{if(a.dataset.nav===activeChapter)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});if(!['game','lab'].includes(activeChapter))stopPacket();if(activeChapter!=='lab')stopPipeline();}
function queueProgress(){if(!scrollTick){scrollTick=true;requestAnimationFrame(onProgress);}}
window.addEventListener('scroll',queueProgress,{passive:true});window.addEventListener('resize',queueProgress,{passive:true});queueProgress();

let dragging=false,lastX=0,lastY=0;$$('[data-grab]').forEach(surface=>{
 surface.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;lastX=e.clientX;lastY=e.clientY;surface.setPointerCapture(e.pointerId);});
 surface.addEventListener('pointermove',e=>{if(!dragging)return;world.rotate(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(ev,()=>dragging=false);
 surface.addEventListener('keydown',e=>{const delta={ArrowLeft:[-22,0],ArrowRight:[22,0],ArrowUp:[0,-16],ArrowDown:[0,16]}[e.key];if(delta){e.preventDefault();world.rotate(...delta);}if(e.key===' '&&surface.dataset.grab==='core'){e.preventDefault();world.pulse();}});
});
$('[data-scene-action="core"]').addEventListener('click',()=>world.pulse());
$$('[data-reality]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.reality;$$('[data-reality]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});$('#reality-detail').textContent=REALITIES[key];world.pulse();}));
let warehouseIndex=0;const warehouseDescriptions=['Lô mô phỏng sẵn sàng tại khu vực nhận hàng.','RECEIVE → STOCK: Luồng mô phỏng chuyển vị trí lưu kho.','STOCK → PICK: Tạo yêu cầu lấy hàng trong mô hình.','PICK → SHIP: Hoàn thành hành trình minh họa, không ghi SAP.'];
$('#warehouse-move').addEventListener('click',()=>{warehouseIndex=nextIndex(warehouseIndex,warehouseDescriptions.length);world.setScene('warehouse');world.setWarehouse(warehouseIndex/(warehouseDescriptions.length-1));$('#warehouse-status').textContent=warehouseDescriptions[warehouseIndex];});

$$('[data-bench]').forEach(button=>button.addEventListener('click',()=>{setBench(button.dataset.bench);}));
function setBench(key){const value=BENCH[key];if(!value)return;$$('[data-bench]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bench===key)));const info=$('#bench-info');info.replaceChildren(addText(document.createDocumentFragment(),'strong',value.name),addText(document.createDocumentFragment(),'p',value.description));world.setBench(key);}
setBench('mobile');

// Packet sequence is an educational, deterministic, purely local model.
let packetIndex=0,packetTimer=null;const packetNodes=$('#packet-nodes');
PACKET.forEach((s,i)=>{const b=el('button',{text:s.name,attrs:{type:'button','aria-pressed':'false','aria-label':`Giai đoạn ${i+1}: ${s.name}`}});b.addEventListener('click',()=>{stopPacket();showPacket(i);});packetNodes.append(b);});
function showPacket(i){packetIndex=Math.max(0,Math.min(PACKET.length-1,i));$$('button',packetNodes).forEach((b,n)=>{b.classList.toggle('active',n===packetIndex);b.setAttribute('aria-pressed',String(n===packetIndex));});const stage=PACKET[packetIndex];$('#packet-detail').replaceChildren(addText(document.createDocumentFragment(),'strong',`0${packetIndex+1} / 0${PACKET.length} — ${stage.name}`),addText(document.createDocumentFragment(),'p',stage.description));world.setPacket(packetIndex);}
function stopPacket(){if(packetTimer){clearInterval(packetTimer);packetTimer=null;}$('#packet-play').textContent='▶ PHÁT';$('#packet-play').setAttribute('aria-pressed','false');}
function startPacket(){if(packetIndex===PACKET.length-1)showPacket(0);stopPacket();$('#packet-play').textContent='Ⅱ DỪNG';$('#packet-play').setAttribute('aria-pressed','true');packetTimer=setInterval(()=>{if(packetIndex<PACKET.length-1){showPacket(packetIndex+1);}else stopPacket();},Number($('#packet-speed').value));}
$('#packet-play').addEventListener('click',()=>packetTimer?stopPacket():startPacket());$('#packet-step').addEventListener('click',()=>{stopPacket();showPacket(nextIndex(packetIndex,PACKET.length));});$('#packet-reset').addEventListener('click',()=>{stopPacket();showPacket(0);});$('#packet-speed').addEventListener('change',()=>{if(packetTimer)startPacket();});showPacket(0);

const archOptions=$('#architecture-options');ARCHITECTURE.forEach((stage,i)=>{const b=el('button',{text:stage.name,attrs:{type:'button','aria-pressed':'false'}});b.addEventListener('click',()=>showArchitecture(i));archOptions.append(b);});
function showArchitecture(i){$$('button',archOptions).forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-pressed',String(n===i));});const item=ARCHITECTURE[i];$('#architecture-detail').replaceChildren(addText(document.createDocumentFragment(),'strong',item.name),addText(document.createDocumentFragment(),'p',item.detail));}
showArchitecture(0);
let pipelineIndex=0,pipelineTimer=null;const pipelineStages=$('#pipeline-stages');PIPELINE.forEach((item,i)=>{const b=el('button',{text:item.name,attrs:{type:'button','aria-pressed':'false'}});b.addEventListener('click',()=>{stopPipeline();showPipeline(i);});pipelineStages.append(b);});
function showPipeline(i){pipelineIndex=Math.max(0,Math.min(PIPELINE.length-1,i));$$('button',pipelineStages).forEach((b,n)=>{b.classList.toggle('active',n===pipelineIndex);b.setAttribute('aria-pressed',String(n===pipelineIndex));});const item=PIPELINE[pipelineIndex];$('#pipeline-detail').replaceChildren(addText(document.createDocumentFragment(),'strong',item.name),addText(document.createDocumentFragment(),'p',item.description));}
function stopPipeline(){if(pipelineTimer){clearInterval(pipelineTimer);pipelineTimer=null;}$('#pipeline-play').textContent='▶ PHÁT';$('#pipeline-play').setAttribute('aria-pressed','false');}
function startPipeline(){if(pipelineIndex===PIPELINE.length-1)showPipeline(0);stopPipeline();$('#pipeline-play').textContent='Ⅱ DỪNG';$('#pipeline-play').setAttribute('aria-pressed','true');pipelineTimer=setInterval(()=>{if(pipelineIndex<PIPELINE.length-1)showPipeline(pipelineIndex+1);else stopPipeline();},1000);}
$('#pipeline-play').addEventListener('click',()=>pipelineTimer?stopPipeline():startPipeline());$('#pipeline-step').addEventListener('click',()=>{stopPipeline();showPipeline(nextIndex(pipelineIndex,PIPELINE.length));});$('#pipeline-reset').addEventListener('click',()=>{stopPipeline();showPipeline(0);});showPipeline(0);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPacket();stopPipeline();}});

// Fixed allowlist; never evaluate or send input. Text always rendered with textContent.
const output=$('#terminal-output'),terminalInput=$('#terminal-input');let history=[],hIndex=0;
function printLine(message,typed=false){const line=el('p',{text:message,className:typed?'typed':''});output.append(line);while(output.children.length>28)output.firstChild.remove();output.scrollTop=output.scrollHeight;}
printLine('THACH.OS / SAFE LOCAL TERMINAL');printLine('Gõ help để xem các lệnh có sẵn. Không thực thi mã hoặc kết nối server.');
$('#terminal-form').addEventListener('submit',event=>{event.preventDefault();const cmd=terminalInput.value.trim();terminalInput.value='';if(!cmd)return;history.push(cmd);if(history.length>20)history.shift();hIndex=history.length;const result=terminalResult(cmd);if(result===null){output.replaceChildren();return;}printLine('thach@os:~$ '+cmd.slice(0,64),true);printLine(result);});
terminalInput.addEventListener('keydown',event=>{if(event.key==='ArrowUp'){event.preventDefault();hIndex=Math.max(0,hIndex-1);terminalInput.value=history[hIndex]||'';}if(event.key==='ArrowDown'){event.preventDefault();hIndex=Math.min(history.length,hIndex+1);terminalInput.value=history[hIndex]||'';}});

// Project cards are intentionally unique editorial case studies, never fake dashboard data.
const projectList=$('#project-selector');PROJECTS.forEach((p,i)=>{const b=el('button',{text:`${String(i+1).padStart(2,'0')} / ${p.name}`,attrs:{type:'button','aria-pressed':'false','data-project':p.slug}});b.addEventListener('click',()=>selectProject(p.slug,true));projectList.append(b);});
function selectProject(slug,changeUrl=false){const p=validProject(slug)||PROJECTS[0],i=PROJECTS.indexOf(p);$$('button',projectList).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.project===p.slug)));const card=$('#case-study');card.replaceChildren();const left=el('div',{className:'case-heading'}),right=el('div',{className:'case-body'});addText(left,'span',`${String(i+1).padStart(2,'0')} / ${p.category}`,'case-serial');addText(left,'h3',p.name);addText(left,'p',p.stack,'case-stack');for(const [title,value] of [['VẤN ĐỀ',p.problem],['CÁCH TIẾP CẬN',p.approach],['BẰNG CHỨNG / GIỚI HẠN',p.evidence]]){const d=el('div');addText(d,'strong',title);addText(d,'p',value);right.append(d);}const links=el('div',{className:'case-links'});links.append(el('a',{text:'XEM SOURCE ↗',attrs:{href:p.source,target:'_blank',rel:'noopener noreferrer'}}));if(p.extra)links.append(el('a',{text:'XEM TRIỂN KHAI / RELEASE ↗',attrs:{href:p.extra,target:'_blank',rel:'noopener noreferrer'}}));const share=el('button',{text:'SAO CHÉP LINK ↗',attrs:{type:'button'}});share.addEventListener('click',async()=>{const link=new URL(projectHref(p.slug),location.href).href;try{await navigator.clipboard.writeText(link);share.textContent='ĐÃ SAO CHÉP ✓';}catch{share.textContent=link;}});links.append(share);right.append(links);card.append(left,right);if(changeUrl){const url=new URL(location.href);url.searchParams.set('project',p.slug);url.hash='projects';history.replaceState(null,'',url.pathname+url.search+url.hash);}return p;}
const deepLink=new URL(location.href).searchParams.get('project');selectProject(deepLink||PROJECTS[0].slug);
window.addEventListener('popstate',()=>selectProject(new URL(location.href).searchParams.get('project')));

// Public GitHub REST only: no token, private endpoints, or untrusted HTML insertion.
let githubRequest=null;
async function refreshGithub(){if(githubRequest)githubRequest.abort();const controller=new AbortController();githubRequest=controller;$('#github-state').textContent='Đang lấy tình trạng public repository…';try{const timeout=setTimeout(()=>controller.abort(),4500);let response;try{response=await fetch('https://api.github.com/repos/thachdeptrai/me',{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});}finally{clearTimeout(timeout);}if(!response.ok)throw Error(`HTTP ${response.status}`);const data=await response.json();if(data.full_name!=='thachdeptrai/me')throw Error('Unexpected repository');const updated=new Date(data.pushed_at);const date=Number.isNaN(updated.valueOf())?'không rõ':updated.toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'});$('#github-state').textContent=`GitHub public API · thachdeptrai/me · Cập nhật repo: ${date}`;}catch{$('#github-state').textContent='GitHub API hiện không khả dụng. Các liên kết source đã xác minh vẫn hoạt động.';}finally{if(githubRequest===controller)githubRequest=null;}}
$('#github-refresh').addEventListener('click',refreshGithub);refreshGithub();

// Searchable keyboard dialog with the same actions as visible chapter links.
const dialog=$('#command-dialog'),search=$('#command-search'),results=$('#command-results');let choices=[],selected=0;
const commands=[...CHAPTERS.map(c=>({name:c.label,url:'#'+c.id})),...PROJECTS.map(p=>({name:p.name,url:projectHref(p.slug)})),{name:'GitHub',url:'https://github.com/thachdeptrai'}];
function closeCommand(){if(dialog.open)dialog.close();}
function navigateCommand(action){closeCommand();if(action.url.startsWith('http')){window.open(action.url,'_blank','noopener,noreferrer');return;}if(action.url.includes('?')){const parsed=new URL(action.url,location.href);selectProject(parsed.searchParams.get('project'),true);$('#projects').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}else{const node=$(action.url);node?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}}
function renderCommands(){const q=search.value.trim().toLocaleLowerCase('vi-VN');choices=commands.filter(c=>c.name.toLocaleLowerCase('vi-VN').includes(q));selected=0;drawCommands();}
function drawCommands(){results.replaceChildren();if(!choices.length){addText(results,'p','Không có kết quả phù hợp.');return;}choices.forEach((item,i)=>{const b=el('button',{text:item.name,attrs:{type:'button','aria-selected':String(i===selected)}});b.addEventListener('click',()=>navigateCommand(item));results.append(b);});}
function openCommand(){if(!dialog.open)dialog.showModal();search.value='';renderCommands();search.focus();}
$('#command-open').addEventListener('click',openCommand);$('#command-close').addEventListener('click',closeCommand);search.addEventListener('input',renderCommands);
search.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!choices.length)return;selected=(selected+(e.key==='ArrowDown'?1:-1)+choices.length)%choices.length;drawCommands();$$('button',results)[selected]?.scrollIntoView({block:'nearest'});}if(e.key==='Enter'&&choices.length){e.preventDefault();navigateCommand(choices[selected]);}});
dialog.addEventListener('click',e=>{if(e.target===dialog)closeCommand();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dialog.open?closeCommand():openCommand();}else if(e.key==='/'&&!dialog.open&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();openCommand();}});

window.addEventListener('pagehide',()=>{stopPacket();stopPipeline();world.dispose();},{once:true});
