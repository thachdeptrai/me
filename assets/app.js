import { fields, networkSteps, cases } from './data.js';
import { createUniverse } from './universe.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
let universe = {setPaused(){},select(){}};
try { universe = createUniverse($('#universe-canvas'), {reducedMotion: motionPaused}); }
catch { $('#universe').classList.add('webgl-fallback'); }
const motionButton = $('#motion-toggle');
function applyMotion() {
  universe.setPaused(motionPaused);
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed',String(motionPaused));
  motionButton.setAttribute('aria-label',motionPaused?'Bật chuyển động':'Tạm dừng chuyển động');
  motionButton.textContent=motionPaused?'▶':'Ⅱ';
}
motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;applyMotion();if(motionPaused)stopPacket();});
reducedMotion.addEventListener('change',event=>{motionPaused=event.matches;applyMotion();if(motionPaused)stopPacket();});
applyMotion();
let orbitManuallyChosen = false;
$('[data-field]').forEach((button,index)=>{
  button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{
    orbitManuallyChosen = true;
    $('[data-field]').forEach(node=>{node.classList.remove('is-active');node.setAttribute('aria-pressed','false');});
    button.classList.add('is-active');button.setAttribute('aria-pressed','true');
    const field=fields[button.dataset.field];
    $('#field-name').textContent=field.name;$('#field-description').textContent=field.description;
    universe.select(index);
  });
});

const menuButton=$('.menu-toggle'),mobileNav=$('#mobile-nav');
function setMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Đóng menu':'Mở menu');mobileNav.hidden=!open;}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
$$('a',mobileNav).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){setMenu(false);menuButton.focus();}});
document.addEventListener('click',e=>{if(!mobileNav.hidden&&!$('.site-header').contains(e.target))setMenu(false);});
matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});

// Native ARIA tabs: arrows/Home/End work, and focus remains on the selected tab.
const projectTabs=$$('[data-project]');
function selectProject(tab,moveFocus=false){
  projectTabs.forEach(button=>{
    const selected=button===tab;
    button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
    $('#project-'+button.dataset.project).hidden=!selected;
  });
  if(moveFocus)tab.focus();
}
projectTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectProject(tab));
  tab.addEventListener('keydown',e=>{
    let next;
    if(e.key==='ArrowRight')next=(index+1)%projectTabs.length;
    else if(e.key==='ArrowLeft')next=(index+projectTabs.length-1)%projectTabs.length;
    else if(e.key==='Home')next=0;
    else if(e.key==='End')next=projectTabs.length-1;
    if(next!==undefined){e.preventDefault();selectProject(projectTabs[next],true);}
  });
});

const flowNodes=$$('[data-step]'),packetButton=$('#packet-toggle');
let packetIndex=0,packetTimer=null;
function selectPacket(index){
  packetIndex=index;
  const step=networkSteps[index];
  flowNodes.forEach((node,i)=>{node.classList.toggle('is-active',i===index);node.setAttribute('aria-pressed',String(i===index));});
  $('#packet-step').textContent=String(index+1).padStart(2,'0')+' / '+step.name;
  $('#packet-description').textContent=step.text;
  $('.packet-progress span').style.width=((index+1)/networkSteps.length*100)+'%';
}
function stopPacket(){clearInterval(packetTimer);packetTimer=null;packetButton.textContent='▶ Chạy gói tin';packetButton.setAttribute('aria-pressed','false');}
flowNodes.forEach((node,index)=>node.addEventListener('click',()=>{stopPacket();selectPacket(index);}));
packetButton.addEventListener('click',()=>{
  if(packetTimer){stopPacket();return;}
  packetButton.textContent='Ⅱ Tạm dừng';packetButton.setAttribute('aria-pressed','true');
  if(packetIndex===networkSteps.length-1)selectPacket(0);
  packetTimer=setInterval(()=>{
    if(packetIndex<networkSteps.length-1)selectPacket(packetIndex+1);
    else stopPacket();
  },1700);
});
selectPacket(0);
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopPacket();}).observe($('#systems'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPacket();});

function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
for(const [index,item] of cases.entries()){
  const details=element('details'),summary=element('summary'),body=element('div',undefined,'case-body'),dl=element('dl');
  if(index===0)details.open=true;
  summary.append(element('span',String(index+1).padStart(2,'0')),element('h3',item.title),element('span','+'));
  summary.lastChild.setAttribute('aria-hidden','true');
  for(const [key,title] of [['problem','PROBLEM'],['cause','CAUSE'],['solution','SOLUTION'],['result','RESULT']])dl.append(element('dt',title),element('dd',item[key]));
  body.append(dl,element('small',item.note));
  if(item.source&&publicGitHubURL(item.source)){const link=element('a','Xem bằng chứng trên GitHub ↗','text-link');link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';body.append(link);}
  details.append(summary,body);$('#case-list').append(details);
}

let scrollPending=false;
// V2 camera storytelling: scroll modifies the WebGL view only in the hero,
 // respecting reduced motion, manual orbit selection and small screens.
let storyCameraStage = -1;
function updateStoryCamera(){
  if (motionPaused || orbitManuallyChosen || innerWidth < 801) return;
  const hero = $('#home');
  const rect = hero.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= innerHeight) return;
  const fraction = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * .82)));
  const stage = Math.min(7, Math.floor(fraction * 8));
  if (stage !== storyCameraStage) {
    universe.select(stage);
    storyCameraStage = stage;
  }
}
function updateProgress(){
  const height=document.documentElement.scrollHeight-innerHeight;
  $('.reading-progress span').style.transform='scaleX('+Math.min(1,Math.max(0,height>0?scrollY/height:0))+')';updateStoryCamera();scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress,{passive:true});updateProgress();
const navLinks=$$('.desktop-nav a');
const activeObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      navLinks.forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('is-current',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
  }
},{rootMargin:'-15% 0px -60% 0px',threshold:0});
navLinks.forEach(link=>{const section=$(link.hash);if(section)activeObserver.observe(section);});

$('#copy-email').addEventListener('click',async()=>{
  const email='ngocthachgenz@gmail.com';
  try{await navigator.clipboard.writeText(email);$('#copy-status').textContent='Đã sao chép email.';}
  catch{$('#copy-status').textContent='Email: '+email+' — chạm giữ để sao chép.';}
});

// Public GitHub requests only. No tokens; failures retain verified project links.
async function getGitHub(path){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),7000);
  try{
    const response=await fetch('https://api.github.com/'+path,{signal:controller.signal,headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error('GitHub temporarily unavailable');return await response.json();
  }finally{clearTimeout(timeout);}
}
const formatDate=value=>new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(value));
function publicGitHubURL(value){try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='github.com'&&url.pathname.startsWith('/thachdeptrai/');}catch{return false;}}
function repoCard(repo){
  const card=element('a');card.href=repo.html_url;card.target='_blank';card.rel='noopener noreferrer';
  card.append(element('span','PUBLIC REPOSITORY ↗','mono'),element('h3',repo.name),element('p',repo.description||'Xem mã nguồn và lịch sử phát triển trên GitHub.'));
  const meta=element('div',undefined,'repo-meta');
  if(repo.language)meta.append(element('span',repo.language));
  if(Number.isFinite(repo.stargazers_count))meta.append(element('span','☆ '+repo.stargazers_count));
  if(repo.pushed_at)meta.append(element('span',formatDate(repo.pushed_at)));
  card.append(meta);return card;
}
async function loadGitHub(){
  const status=$('#github-status');status.textContent='Đang lấy dữ liệu công khai từ GitHub…';
  const [reposResult,releaseResult]=await Promise.allSettled([
    getGitHub('users/thachdeptrai/repos?type=owner&sort=pushed&per_page=100'),
    getGitHub('repos/thachdeptrai/NroGT-Releases/releases/latest')
  ]);
  if(reposResult.status==='fulfilled'&&Array.isArray(reposResult.value)){
    const repos=reposResult.value.filter(repo=>!repo.private&&publicGitHubURL(repo.html_url));
    const names=['NroGT','NroGT2','PhonePulse'];
    const selected=names.map(name=>repos.find(repo=>repo.name===name)).filter(Boolean);
    if(selected.length){$('#github-repos').replaceChildren(...selected.map(repoCard));}
    const date=new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit'}).format(new Date());
    status.textContent='Dữ liệu trực tiếp từ GitHub · cập nhật '+date+'. Ngôn ngữ và sao lấy từ từng repository.';
    const recent=repos.filter(repo=>repo.pushed_at&&!repo.archived).sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at))[0];
    if(recent){const link=element('a',recent.name+' ↗');link.href=recent.html_url;link.target='_blank';link.rel='noopener noreferrer';$('#github-activity').replaceChildren(link,document.createTextNode(' · cập nhật '+formatDate(recent.pushed_at)));}
  }else status.textContent='GitHub API tạm không khả dụng. Các liên kết project vẫn hoạt động; xem dữ liệu trực tiếp trên GitHub.';
  if(releaseResult.status==='fulfilled'&&publicGitHubURL(releaseResult.value.html_url)){
    const release=releaseResult.value,link=$('#latest-release');
    link.href=release.html_url;link.textContent=(release.name||release.tag_name)+(release.published_at?' · '+formatDate(release.published_at):'')+' ↗';
    const assetNames=(release.assets||[]).map(asset=>asset.name).join(' / ');
    $('#release-note').textContent=assetNames||'Thông tin phát hành trực tiếp từ GitHub.';
  }else $('#release-note').textContent='Bản đã xác minh ngày 19.09.2026 · kiểm tra GitHub để xem bản mới hơn.';
}
let githubLoaded=false;
const githubObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!githubLoaded){githubLoaded=true;loadGitHub();githubObserver.disconnect();}},{rootMargin:'400px'});
githubObserver.observe($('#github'));
