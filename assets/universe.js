/** A small dependency-free WebGL renderer for the interactive technology universe.
 * Geometry is authored mathematically; no image, analytics, tracking or CDN needed.
 */
export function createUniverse(canvas, { reducedMotion = false } = {}) {
  const host = canvas.parentElement;
  const gl = canvas.getContext('webgl', {alpha:true,antialias:true,powerPreference:'low-power'});
  if (!gl) return createSoftwareUniverse(canvas, reducedMotion);
  const vs = `
    attribute vec3 a_position;
    attribute vec4 a_color;
    attribute float a_size;
    uniform float u_yaw, u_pitch, u_aspect, u_pixel;
    varying vec4 v_color;
    void main(){
      float cy=cos(u_yaw),sy=sin(u_yaw),cx=cos(u_pitch),sx=sin(u_pitch);
      vec3 p=vec3(a_position.x*cy+a_position.z*sy,a_position.y,-a_position.x*sy+a_position.z*cy);
      p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx);
      float distance=4.6-p.z;
      gl_Position=vec4(p.x*2.6/(distance*u_aspect),p.y*2.6/distance,0.0,1.0);
      gl_PointSize=clamp(a_size*u_pixel*(4.0/distance),1.0,24.0);
      float depth=clamp((p.z+2.5)/4.5,0.08,1.0);
      v_color=vec4(a_color.rgb,a_color.a*(0.28+depth*0.72));
    }`;
  const fs = `
    precision mediump float;
    uniform bool u_points;
    varying vec4 v_color;
    void main(){
      float alpha=v_color.a;
      if(u_points){float d=length(gl_PointCoord-vec2(0.5))*2.0;if(d>1.0)discard;alpha*=pow(1.0-d,1.2);}
      gl_FragColor=vec4(v_color.rgb,alpha);
    }`;
  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('WebGL shader unavailable');}
    return s;
  }
  let program;
  try {
    program=gl.createProgram();
    const vertex=shader(gl.VERTEX_SHADER,vs),fragment=shader(gl.FRAGMENT_SHADER,fs);
    gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
    gl.deleteShader(vertex);gl.deleteShader(fragment);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('WebGL program unavailable');
  } catch {
    const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);
    return createSoftwareUniverse(replacement, reducedMotion);
  }
  gl.useProgram(program);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(0,0,0,0);
  const attrs={position:gl.getAttribLocation(program,'a_position'),color:gl.getAttribLocation(program,'a_color'),size:gl.getAttribLocation(program,'a_size')};
  const uniform=Object.fromEntries(['yaw','pitch','aspect','pixel','points'].map(n=>[n,gl.getUniformLocation(program,'u_'+n)]));
  const lines=[],points=[];
  const mint=[.58,.98,.78],blue=[.42,.7,.95],purple=[.65,.54,.95];
  const put=(arr,p,c,alpha,size=2)=>arr.push(...p,...c,alpha,size);
  const line=(a,b,c,alpha)=>{put(lines,a,c,alpha);put(lines,b,c,alpha);};
  const sphere=(theta,phi,r=1.13)=>[r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta)];
  const lat=23,lng=48;
  for(let a=0;a<lat;a++){
    const p1=Math.PI*(a+1)/(lat+1),p2=Math.PI*(a+2)/(lat+1);
    for(let b=0;b<lng;b++){
      const t=b*Math.PI*2/lng,t2=(b+1)*Math.PI*2/lng;
      const p=sphere(t,p1),next=sphere(t2,p1);
      line(p,next,mint,.26);
      if(a<lat-1){line(p,sphere(t,p2),blue,.17);if((a+b)%2===0)line(p,sphere(t2,p2),mint,.08);}
      if((a+b)%5===0)put(points,p,mint,.8,3.8);
    }
  }
  // Tilted 3D orbits represent the interconnected technical disciplines.
  function orbit(t,r,tilt,twist){
    let x=Math.cos(t)*r,y=Math.sin(t)*r,z=0;
    const yp=y*Math.cos(tilt)-z*Math.sin(tilt),zp=y*Math.sin(tilt)+z*Math.cos(tilt);
    return [x*Math.cos(twist)-yp*Math.sin(twist),x*Math.sin(twist)+yp*Math.cos(twist),zp];
  }
  for(let ring=0;ring<4;ring++){
    const r=1.52+ring*.13,tilt=.85+ring*.42,twist=ring*.9;
    const col=ring%2===0?mint:purple;
    for(let j=0;j<280;j++){
      const t=j*Math.PI*2/280;
      line(orbit(t,r,tilt,twist),orbit(t+Math.PI*2/280,r,tilt,twist),col,ring===0?.65:.37);
      if(j%70===0){const p=orbit(t,r,tilt,twist);put(points,p,col,1,13);line(p,p.map(v=>v*.69),col,.17);}
    }
  }
  // Deterministic stars: stable composition on every visit and device.
  let seed=1267;
  const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  for(let i=0;i<260;i++){
    const theta=random()*Math.PI*2,phi=Math.acos(2*random()-1),r=2+random()*.6;
    put(points,sphere(theta,phi,r),i%3?mint:purple,.23+random()*.35,1.2+random()*2.1);
  }
  function buffer(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return {buffer:b,count:data.length/8};}
  const lineBuffer=buffer(lines),pointBuffer=buffer(points);
  function bind(data){gl.bindBuffer(gl.ARRAY_BUFFER,data.buffer);gl.enableVertexAttribArray(attrs.position);gl.vertexAttribPointer(attrs.position,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(attrs.color);gl.vertexAttribPointer(attrs.color,4,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(attrs.size);gl.vertexAttribPointer(attrs.size,1,gl.FLOAT,false,32,28);}
  let yaw=.35,pitch=.1,targetYaw=.35,targetPitch=.1,spin=0,frame=0,last=0,paused=reducedMotion,visible=true,lost=false,dragging=false,x=0,y=0;
  let aspect=1,dpr=1;
  function resize(){
    const rect=canvas.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.75);aspect=rect.width/Math.max(1,rect.height);
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);draw();
  }
  function draw(){
    if(lost)return;
    gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniform.yaw,yaw+spin);gl.uniform1f(uniform.pitch,pitch);gl.uniform1f(uniform.aspect,aspect);gl.uniform1f(uniform.pixel,dpr);
    bind(lineBuffer);gl.uniform1i(uniform.points,0);gl.drawArrays(gl.LINES,0,lineBuffer.count);
    bind(pointBuffer);gl.uniform1i(uniform.points,1);gl.drawArrays(gl.POINTS,0,pointBuffer.count);
  }
  function loop(now){
    frame=0;if(paused||!visible||document.hidden||lost)return;
    const dt=Math.min(50,now-last||16);last=now;
    if(!dragging)spin+=dt*.000075;
    yaw+=(targetYaw-yaw)*.09;pitch+=(targetPitch-pitch)*.09;draw();
    frame=requestAnimationFrame(loop);
  }
  function start(){if(!frame&&!paused&&visible&&!document.hidden&&!lost){last=performance.now();frame=requestAnimationFrame(loop);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  canvas.addEventListener('pointerdown',e=>{dragging=true;x=e.clientX;y=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;
    targetYaw+=(e.clientX-x)*.006;targetPitch=Math.max(-.65,Math.min(.65,targetPitch+(e.clientY-y)*.004));x=e.clientX;y=e.clientY;
    if(paused){yaw=targetYaw;pitch=targetPitch;draw();}
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{dragging=false;});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stop();host.classList.add('webgl-fallback');});
  // Keep accessible HTML controls/content available even after context loss.
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{rootMargin:'100px'}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  resize();start();
  host.dataset.renderer='webgl';
  return {
    setPaused(value){paused=value;if(paused){stop();draw();}else start();},
    select(index){targetYaw=.35+index*.27;if(paused){yaw=targetYaw;draw();}}
  };
}

// CPU perspective projection preserves the 3D scene when WebGL is unavailable.
// This is the same type of real 3D geometry, rendered into a 2D canvas at 30 fps.
function createSoftwareUniverse(canvas, initiallyPaused) {
  const host=canvas.parentElement,ctx=canvas.getContext('2d');
  if(!ctx){host.classList.add('webgl-fallback');return {setPaused(){},select(){}};}
  host.dataset.renderer='canvas-3d';
  host.classList.remove('webgl-fallback');
  const segments=[],dots=[],mint=[155,246,202],blue=[94,161,227],purple=[180,162,252];
  const sphere=(t,p,r=1.13)=>[r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t)];
  const lat=17,lng=36;
  for(let i=1;i<lat;i++)for(let j=0;j<lng;j++){
    const p=i*Math.PI/lat,t=j*Math.PI*2/lng,a=sphere(t,p);
    segments.push([a,sphere(t+Math.PI*2/lng,p),mint,.29]);
    if(i<lat-1)segments.push([a,sphere(t,p+Math.PI/lat),blue,.2]);
    if((i+j)%3===0)dots.push([a,mint,.65,1.35]);
  }
  function ring(t,r,tilt,twist){const x=Math.cos(t)*r,y=Math.sin(t)*r*Math.cos(tilt),z=Math.sin(t)*r*Math.sin(tilt);return [x*Math.cos(twist)-y*Math.sin(twist),x*Math.sin(twist)+y*Math.cos(twist),z];}
  for(let i=0;i<4;i++){
    const r=1.52+i*.13,tilt=.85+i*.42,twist=i*.9,col=i%2?purple:mint;
    for(let j=0;j<160;j++){
      const t=j*Math.PI*2/160,a=ring(t,r,tilt,twist);
      segments.push([a,ring(t+Math.PI*2/160,r,tilt,twist),col,i===0?.75:.48]);
      if(j%40===0){dots.push([a,col,1,3.5]);segments.push([a,a.map(v=>v*.67),col,.15]);}
    }
  }
  let seed=237;
  const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  for(let i=0;i<130;i++)dots.push([sphere(rand()*Math.PI*2,Math.acos(2*rand()-1),2+rand()*.4),i%3?mint:purple,.2+rand()*.5,.7+rand()*.7]);
  let width=0,height=0,dpr=1,yaw=.35,pitch=.1,targetYaw=.35,targetPitch=.1,spin=0,frame=0,last=0,paused=initiallyPaused,visible=true,dragging=false,x=0,y=0;
  function project(p){
    const cy=Math.cos(yaw+spin),sy=Math.sin(yaw+spin),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const tx=p[0]*cy+p[2]*sy,tz=-p[0]*sy+p[2]*cy;
    const ty=p[1]*cx-tz*sx,z=p[1]*sx+tz*cx,k=height*1.3/(4.6-z);
    return [width/2+tx*k,height/2-ty*k,z];
  }
  function draw(){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(width/2,height/2,12,width/2,height/2,height*.35);
    glow.addColorStop(0,'rgba(38,118,97,.08)');glow.addColorStop(.55,'rgba(38,118,97,.04)');glow.addColorStop(1,'rgba(38,118,97,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);ctx.lineWidth=.7;
    for(const [pa,pb,c,alpha] of segments){
      const a=project(pa),b=project(pb),depth=Math.max(.16,Math.min(1,((a[2]+b[2])*.5+2.5)/4.5));
      ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${alpha*(.28+depth*.72)})`;
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    }
    for(const [p,c,alpha,size] of dots){
      const a=project(p),depth=Math.max(.16,Math.min(1,(a[2]+2.5)/4.5));
      if(size>3){ctx.shadowBlur=14;ctx.shadowColor=`rgba(${c.join(',')},.8)`;}else ctx.shadowBlur=0;
      ctx.fillStyle=`rgba(${c.join(',')},${alpha*(.25+depth*.75)})`;
      ctx.beginPath();ctx.arc(a[0],a[1],size*4/(4.6-a[2]),0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;
  }
  function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw();}
  function loop(now){
    frame=0;if(paused||!visible||document.hidden)return;
    const dt=now-last;
    if(dt>=33){last=now;if(!dragging)spin+=Math.min(dt,70)*.000075;yaw+=(targetYaw-yaw)*.15;pitch+=(targetPitch-pitch)*.15;draw();}
    frame=requestAnimationFrame(loop);
  }
  function start(){if(!frame&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(loop);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  canvas.addEventListener('pointerdown',e=>{dragging=true;x=e.clientX;y=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetYaw+=(e.clientX-x)*.006;targetPitch=Math.max(-.65,Math.min(.65,targetPitch+(e.clientY-y)*.004));x=e.clientX;y=e.clientY;if(paused){yaw=targetYaw;pitch=targetPitch;draw();}});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{dragging=false;});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{rootMargin:'100px'}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  resize();start();
  return {setPaused(value){paused=value;if(paused){stop();draw();}else start();},select(index){targetYaw=.35+index*.27;if(paused){yaw=targetYaw;draw();}}};
}
