/* THACH.OS V2: progressive enhancement; original app.js remains source of truth for legacy features. */
const os = (selector, root = document) => root.querySelector(selector);
const osa = (selector, root = document) => [...root.querySelectorAll(selector)];
const OS_SECTIONS = [
  ['home', 'Arrival'], ['currently', 'Current reality'], ['about', 'Identity'],
  ['capabilities', 'Technology'], ['work', 'Project galaxy'], ['systems', 'Network'],
  ['shipping', 'Build pipeline'], ['problems', 'Debug diaries'],
  ['journey', 'Timeline'], ['labs', 'Engineering lab'], ['github', 'GitHub'], ['contact', 'Contact']
];
const OS_MODES = ['cinema', 'focus', 'lite'];
const osModeButton = os('#os-mode');
const osPrefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
let osOwnsMotionPause = false;
function osReadMode() {
  try { const mode = localStorage.getItem('thach-os-mode'); return OS_MODES.includes(mode) ? mode : 'cinema'; }
  catch { return 'cinema'; }
}
function osSaveMode(mode) {
  try { localStorage.setItem('thach-os-mode', mode); } catch { /* storage may be disabled */ }
}
function osSetMode(mode) {
  if (!OS_MODES.includes(mode)) return;
  document.body.classList.remove(...OS_MODES.map(value => 'mode-' + value));
  document.body.classList.add('mode-' + mode);
  const motion = os('#motion-toggle');
  if (mode !== 'cinema') {
    if (motion && motion.getAttribute('aria-pressed') === 'false') {
      motion.click(); osOwnsMotionPause = true;
    }
  } else if (osOwnsMotionPause && !osPrefersReduced.matches) {
    if (motion && motion.getAttribute('aria-pressed') === 'true') motion.click();
    osOwnsMotionPause = false;
  }
  osModeButton.textContent = ({cinema:'◉ Cinema',focus:'◐ Focus',lite:'◇ Lite'})[mode];
  osModeButton.setAttribute('aria-label', 'Chế độ trải nghiệm: ' + mode + '. Bấm để đổi chế độ');
  osModeButton.setAttribute('title','Cinema → Focus → Lite');
  osSaveMode(mode);
}
osModeButton.addEventListener('click', () => {
  const active = OS_MODES.find(mode => document.body.classList.contains('mode-' + mode)) || 'cinema';
  osSetMode(OS_MODES[(OS_MODES.indexOf(active) + 1) % OS_MODES.length]);
});
osSetMode(osReadMode());

const osCounter = os('#os-chapter-counter');
const osProgress = os('#os-chapter-progress span');
let osProgressFrame = 0;
function osUpdateProgress() {
  osProgressFrame = 0;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - innerHeight);
  osProgress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / max)) + ')';
  const probe = innerHeight * .4;
  let chapter = 0;
  OS_SECTIONS.forEach(([id], index) => {
    const node = document.getElementById(id);
    if (node && node.getBoundingClientRect().top <= probe) chapter = index;
  });
  osCounter.textContent = String(chapter + 1).padStart(2, '0') + ' / ' + String(OS_SECTIONS.length).padStart(2, '0') + ' — ' + OS_SECTIONS[chapter][1];
}
function osQueueProgress() {
  if (!osProgressFrame) osProgressFrame = requestAnimationFrame(osUpdateProgress);
}
addEventListener('scroll', osQueueProgress, { passive: true });
addEventListener('resize', osQueueProgress, { passive: true });
osUpdateProgress();

// Command palette is intentionally an allowlisted navigator, never a remote shell.
const osPalette = os('#os-palette');
const osPaletteSearch = os('#os-palette-search');
const osPaletteResults = os('#os-palette-results');
const osActions = OS_SECTIONS.map(([id, name]) => ({ label:name, hint:'CHAPTER', run:() => { location.hash=id; } }));
osActions.push(
  { label:'Switch experience mode',hint:'DISPLAY',run:() => osModeButton.click() },
  { label:'Open GitHub',hint:'LINK',run:() => window.open('https://github.com/thachdeptrai','_blank','noopener,noreferrer') },
  { label:'Contact by email',hint:'MAIL',run:() => { location.href='mailto:ngocthachgenz@gmail.com'; } },
  { label:'Start Packet Lab',hint:'SIMULATION',run:() => { location.hash='os-engineering'; os('#os-packet-play').focus(); } }
);
let osPaletteIndex = 0, osPaletteChoices = [];
function osRenderPalette() {
  const query = osPaletteSearch.value.trim().toLocaleLowerCase('vi-VN');
  osPaletteChoices = osActions.filter(action => action.label.toLocaleLowerCase('vi-VN').includes(query) || action.hint.toLowerCase().includes(query));
  osPaletteIndex = Math.min(osPaletteIndex, Math.max(0, osPaletteChoices.length - 1));
  osPaletteResults.replaceChildren();
  if (!osPaletteChoices.length) {
    const empty = document.createElement('p'); empty.className='os-palette-empty'; empty.textContent='Không tìm thấy mục phù hợp.';
    osPaletteResults.append(empty); return;
  }
  osPaletteChoices.forEach((action, index) => {
    const button = document.createElement('button'); button.type='button'; button.dataset.selected=String(index === osPaletteIndex);
    const label=document.createElement('span');label.textContent=action.label;
    const hint=document.createElement('small');hint.textContent=action.hint;
    button.append(label,hint);
    button.addEventListener('mouseenter',()=>{osPaletteIndex=index;osMarkPalette();});
    button.addEventListener('click',()=>{osPalette.close();action.run();});
    osPaletteResults.append(button);
  });
}
function osMarkPalette() {
  osa('button',osPaletteResults).forEach((button,index) => {
    button.dataset.selected=String(index===osPaletteIndex);
  });
  osa('button',osPaletteResults)[osPaletteIndex]?.scrollIntoView({block:'nearest'});
}
function osOpenPalette() {
  if (!osPalette.open) {osPalette.showModal();osPaletteSearch.value='';osPaletteIndex=0;osRenderPalette();}
  osPaletteSearch.focus();
}
os('#os-palette-open').addEventListener('click',osOpenPalette);
os('#os-palette-close').addEventListener('click',()=>osPalette.close());
osPaletteSearch.addEventListener('input',()=>{osPaletteIndex=0;osRenderPalette();});
osPaletteSearch.addEventListener('keydown',event=>{
  if (event.key==='ArrowDown'||event.key==='ArrowUp') {
    event.preventDefault();if(!osPaletteChoices.length)return;
    osPaletteIndex=(osPaletteIndex+(event.key==='ArrowDown'?1:-1)+osPaletteChoices.length)%osPaletteChoices.length;
    osMarkPalette();
  }
  if(event.key==='Enter' && osPaletteChoices.length) {
    event.preventDefault();const action=osPaletteChoices[osPaletteIndex];osPalette.close();action.run();
  }
});
osPalette.addEventListener('click',event=>{if(event.target===osPalette)osPalette.close();});
document.addEventListener('keydown',event=>{
  if ((event.ctrlKey||event.metaKey) && event.key.toLowerCase()==='k') {event.preventDefault();osPalette.open?osPalette.close():osOpenPalette();return;}
  if(event.key==='/' && !event.ctrlKey && !event.metaKey && !event.altKey &&
     !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
    event.preventDefault();osOpenPalette();
  }
});

// Standalone, explicitly simulated packet journey. Not connected to production infrastructure.
const osPacketStages = [
  ['Browser','Input event is serialized for the demo client.'],
  ['WebSocket','A browser-safe WebSocket frame transports the simulated payload.'],
  ['Gateway','The protocol bridge maps the frame to a TCP byte stream.'],
  ['Java server','Server logic validates and handles the simulated request.'],
  ['Database','Persistence is conditional in a real application; this demo shows a possible storage path.']
];
const osPacketButtons=osa('[data-os-packet]');
const osPacketDetail=os('#os-packet-state');
const osPacketPlay=os('#os-packet-play');
const osPacketSpeed=os('#os-packet-speed');
let osPacketIndex=0, osPacketTimer=null;
function osPacketShow(index) {
  osPacketIndex=Math.max(0,Math.min(index,osPacketStages.length-1));
  osPacketButtons.forEach((button,i)=>{button.dataset.active=String(i===osPacketIndex);button.setAttribute('aria-pressed',String(i===osPacketIndex));});
  const [stage,description]=osPacketStages[osPacketIndex];
  osPacketDetail.replaceChildren();
  const label=document.createElement('strong');label.textContent='SIMULATION · '+String(osPacketIndex+1).padStart(2,'0')+' / 05 · '+stage;
  const detail=document.createElement('p');detail.textContent=description;
  osPacketDetail.append(label,detail);
}
function osPacketStop(){if(osPacketTimer!==null)clearInterval(osPacketTimer);osPacketTimer=null;osPacketPlay.textContent='▶ Play';osPacketPlay.setAttribute('aria-pressed','false');}
function osPacketStart(){
  osPacketStop();
  if(osPacketIndex===osPacketStages.length-1)osPacketShow(0);
  osPacketPlay.textContent='Ⅱ Pause';osPacketPlay.setAttribute('aria-pressed','true');
  osPacketTimer=setInterval(()=>{
    if(osPacketIndex>=osPacketStages.length-1){osPacketStop();return;}
    osPacketShow(osPacketIndex+1);
    if(osPacketIndex===osPacketStages.length-1)osPacketStop();
  },Number(osPacketSpeed.value));
}
osPacketPlay.addEventListener('click',()=>osPacketTimer===null?osPacketStart():osPacketStop());
os('#os-packet-step').addEventListener('click',()=>{osPacketStop();osPacketShow((osPacketIndex+1)%osPacketStages.length);});
os('#os-packet-reset').addEventListener('click',()=>{osPacketStop();osPacketShow(0);});
osPacketSpeed.addEventListener('change',()=>{if(osPacketTimer!==null)osPacketStart();});
osPacketButtons.forEach((button,index)=>button.addEventListener('click',()=>{osPacketStop();osPacketShow(index);}));
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)osPacketStop();}).observe(os('#os-engineering'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)osPacketStop();});
osPacketShow(0);

const osArchitecture = {
  client:['GAME CLIENT','Unity / LibGDX client renders the world, collects input and encodes packets.','WebSocket or TCP → transport'],
  bridge:['TRANSPORT BRIDGE','A gateway translates browser WebSocket traffic into a TCP connection with agreed packet framing.','Client ↔ gateway ↔ Java server'],
  server:['GAME SERVER','The Java server validates requests, applies game rules and updates in-memory state.','Transport → gameplay / storage'],
  storage:['DATABASE','MariaDB persists selected account and character state; not every action is a write.','Server ↔ persistence'],
  web:['WEB SERVICES','Web interfaces expose public information and user-facing operations when authorized.','Browser ↔ web server ↔ database'],
  release:['DEPLOYMENT','Release archives and website assets ship independently to their supported platforms.','CI / GitHub Releases / hosting']
};
const osArchDetail=os('#os-architecture-detail');
function osSelectArchitecture(key) {
  osa('[data-os-arch]').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.osArch===key)));
  const data=osArchitecture[key];if(!data)return;
  osArchDetail.replaceChildren();
  const title=document.createElement('strong');title.textContent=data[0];
  const text=document.createElement('p');text.textContent=data[1];
  const dependency=document.createElement('p');dependency.textContent='FLOW · '+data[2];
  osArchDetail.append(title,text,dependency);
}
osa('[data-os-arch]').forEach(button=>button.addEventListener('click',()=>osSelectArchitecture(button.dataset.osArch)));
osSelectArchitecture('client');

// Terminal: fixed commands only, textContent rendering, bounded history and output.
const osTerminalInput=os('#os-terminal-input');
const osTerminalOutput=os('#os-terminal-output');
let osHistory=[],osHistoryIndex=0;
const osTerminalCommands = {
  help:()=> 'Available: help · about · skills · projects · experience · github · contact · clear',
  about:()=> 'Nguyễn Ngọc Thạch. VinFast / SAP EWM operations and independent software projects.',
  skills:()=> 'React Native · TypeScript · Java · Unity · LibGDX · WebGL · PHP · Networking · SAP EWM',
  projects:()=> 'NRO GT · Java server · mobile applications · web and infrastructure. View #work.',
  experience:()=> 'VinFast: SAP EWM, warehouse data, process and operational troubleshooting.',
  github:()=> 'https://github.com/thachdeptrai',
  contact:()=> 'Email: ngocthachgenz@gmail.com | GitHub: thachdeptrai'
};
function osTerminalPrint(value,command=false) {
  const line=document.createElement('p');if(command)line.className='os-term-command';line.textContent=value;
  osTerminalOutput.append(line);
  while(osTerminalOutput.children.length>35)osTerminalOutput.firstElementChild.remove();
  osTerminalOutput.scrollTop=osTerminalOutput.scrollHeight;
}
os('#os-terminal-form').addEventListener('submit',event=>{
  event.preventDefault();
  const command=osTerminalInput.value.trim().toLowerCase();osTerminalInput.value='';
  if(!command)return;
  osHistory.push(command);if(osHistory.length>30)osHistory.shift();osHistoryIndex=osHistory.length;
  if(command==='clear'){osTerminalOutput.replaceChildren();return;}
  osTerminalPrint('thach@os:~$ '+command,true);
  osTerminalPrint(Object.hasOwn(osTerminalCommands,command)?osTerminalCommands[command]():'Unknown command. Type help.');
});
osTerminalInput.addEventListener('keydown',event=>{
  if(event.key==='ArrowUp'){event.preventDefault();osHistoryIndex=Math.max(0,osHistoryIndex-1);osTerminalInput.value=osHistory[osHistoryIndex]||'';}
  if(event.key==='ArrowDown'){event.preventDefault();osHistoryIndex=Math.min(osHistory.length,osHistoryIndex+1);osTerminalInput.value=osHistory[osHistoryIndex]||'';}
});
osTerminalPrint('THACH.OS LAB / SAFE INTERACTIVE TERMINAL');
osTerminalPrint('Type help to explore. Commands are local, not executed on a server.');

// Shareable URL uses query string without changing the GitHub Pages path.
const osProjectIds=new Set(['nro','server','mobile','cross']);
function osApplySharedProject() {
  const param=new URL(location.href).searchParams.get('project');
  if(!osProjectIds.has(param))return;
  const tab=os('[data-project="'+param+'"]');
  if(tab){tab.click();if(!location.hash)location.hash='work';}
}
osa('[data-share-project]').forEach(button=>button.addEventListener('click',async()=>{
  const id=button.dataset.shareProject;if(!osProjectIds.has(id))return;
  const link=new URL(location.href);link.searchParams.set('project',id);link.hash='work';
  try {await navigator.clipboard.writeText(link.href);button.textContent='✓ Copied';}
  catch {button.textContent=link.href;}
}));
osApplySharedProject();
