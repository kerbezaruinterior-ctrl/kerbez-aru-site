import {stageAtTime} from './build-stages.js';
export function initBuild(){
 const section=document.getElementById('build');if(!section)return;
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger,SplitText=window.SplitText;
 if(!gsap||!ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);const hasSplit=!!SplitText;if(hasSplit)gsap.registerPlugin(SplitText);
 const $=s=>section.querySelector(s),$$=s=>Array.from(section.querySelectorAll(s));
 const removers=[];const listen=(target,type,fn)=>{target.addEventListener(type,fn);removers.push(()=>target.removeEventListener(type,fn))};
 const media=gsap.matchMedia();
 media.add({motion:'(prefers-reduced-motion: no-preference)',mobile:'(max-width:900px)',desktop:'(min-width:901px)',touch:'(any-pointer:coarse)'},match=>{
  if(!match.conditions.motion)return;
  section.classList.add('build-motion');section.querySelectorAll('.b-list button').forEach(b=>b.disabled=false);
  let lenis=null,raf=null,navigating=false;
  if(window.Lenis&&!match.conditions.touch&&navigator.maxTouchPoints===0){lenis=new window.Lenis({duration:.9,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);raf=t=>lenis.raf(t*1000);gsap.ticker.add(raf);gsap.ticker.lagSmoothing(0);window.__lenis=lenis;}
  const anchor=e=>{const a=e.target.closest('a[href^="#"]');if(!a||!lenis)return;const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();ScrollTrigger.getById('interior-build')?.getTween(true)?.kill?.();lenis.start();navigating=true;lenis.scrollTo(target,{duration:1.6,offset:-72,onComplete:()=>{navigating=false}})}};
  listen(document,'click',anchor);
  // Input can interrupt a Lenis anchor before onComplete fires. Never leave snap disabled.
  const manualInput=event=>{if(event.type!=='keydown'||['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))navigating=false;};
  listen(window,'wheel',manualInput);listen(window,'touchstart',manualInput);listen(window,'keydown',manualInput);
  const context=gsap.context(()=>{
var cvs=$('#canvas'),cv=$('#cv');
      function fit(){var s=cvs.getBoundingClientRect().width/1344;cv.style.transform='scale('+s+')'}
      fit();listen(window,'resize',fit);

      /* homography helpers: map 600x440 plan onto any quad */
      function adj(m){return[m[4]*m[8]-m[5]*m[7],m[2]*m[7]-m[1]*m[8],m[1]*m[5]-m[2]*m[4],m[5]*m[6]-m[3]*m[8],m[0]*m[8]-m[2]*m[6],m[2]*m[3]-m[0]*m[5],m[3]*m[7]-m[4]*m[6],m[1]*m[6]-m[0]*m[7],m[0]*m[4]-m[1]*m[3]]}
      function mm3(a,b){var c=[];for(var i=0;i<3;i++)for(var j=0;j<3;j++){var s=0;for(var k=0;k<3;k++)s+=a[3*i+k]*b[3*k+j];c[3*i+j]=s}return c}
      function mv(m,v){return[m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]]}
      function basis(p){var m=[p[0],p[2],p[4],p[1],p[3],p[5],1,1,1];var v=mv(adj(m),[p[6],p[7],1]);return mm3(m,[v[0],0,0,0,v[1],0,0,0,v[2]])}
      function proj(src,dst){var t=mm3(basis(dst),adj(basis(src)));for(var i=0;i<9;i++)t[i]/=t[8];return 'matrix3d('+[t[0],t[3],0,t[6],t[1],t[4],0,t[7],0,0,1,0,t[2],t[5],0,t[8]].join(',')+')'}
      var SRC=[0,0,600,0,0,440,600,440];
      var FLAT=[478,158,1118,158,478,627,1118,627];
      var QUAD=[417,77,1066,144,283,484,1046,503];
      var plan=$('#plan2d'),morph={t:0};
      function applyMorph(){var p=[],t=morph.t;for(var i=0;i<8;i++)p.push(FLAT[i]+(QUAD[i]-FLAT[i])*t);plan.style.transform=proj(SRC,p)}
      applyMorph();

      function prepDraw(els){els.forEach(function(p){var L=p.getTotalLength?p.getTotalLength():1000;p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.dataset.len=L})}
      var gridLines=$$('#grid line'),ow=$$('#plan2d .ow'),pw=$$('#plan2d .pw'),tl3=$$('#lines path');
      prepDraw(ow);prepDraw(pw);prepDraw(tl3);
      gsap.set('#plan2d .gp,#plan2d .dr,#plan2d .lbls,#plan2d .dims',{opacity:0});
      gsap.set(['#grid','#plan2d','#lines'],{opacity:1});
      gsap.set(gridLines,{opacity:0});

      var sts=$$('#bStage .st'),lis=$$('.b-list li'),cur=-1;
      gsap.set(sts,{autoAlpha:0,y:0});
      function setStage(i){
        if(i===cur)return;var prev=cur;cur=i;section.dataset.stage=String(i);sts.forEach((st,j)=>st.setAttribute('aria-hidden',j===i?'false':'true'));lis.forEach(l=>l.querySelector('button')?.setAttribute('aria-current',+l.dataset.i===Math.min(i,8)?'step':'false'));
        lis.forEach(function(l){l.classList.toggle('on',+l.dataset.i===Math.min(i,8))});
        const roomIndex=Math.max(0,i-8);const roomCount=$('[data-room-count]');if(roomCount)roomCount.textContent=(roomIndex+1)+' / 6';
        $$('[data-room-step]').forEach(button=>button.disabled=+button.dataset.roomStep<0?i<=8:i>=13);
        if(prev>=0)gsap.to(sts[prev],{autoAlpha:0,y:-24,duration:.35,ease:'power2.in',overwrite:true});
        gsap.fromTo(sts[i],{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.6,delay:prev>=0?.18:0,ease:'power3.out',overwrite:true});
      }

      /* intro on load: grid + title */
      var bs=hasSplit?SplitText.create('#buildTitle',{type:'words',mask:'words'}):null;
      var intro=gsap.timeline({defaults:{ease:'expo.out'},scrollTrigger:{trigger:section,start:'top 80%',once:true}});
      intro.from(bs?bs.words:'#buildTitle',{yPercent:110,duration:1.3,stagger:.06},.1)
        .from('.b-head .eyebrow',{opacity:0,y:14,duration:1},0)
        .to(gridLines,{opacity:1,duration:.8,stagger:{each:.012,from:'center'},ease:'power1.out'},.2)
        .add(function(){setStage(T?stageAtTime(T.time()):0)},.5)
        .from('.b-list li',{opacity:0,x:16,stagger:.05,duration:.8},.6);

      /* scroll timeline: 8 units, one per stage */
      var cam=$('#cam');gsap.set(cam,{transformOrigin:'0 0'});
      var MOB=matchMedia('(max-width:900px)').matches;
      function shot(z,fx,fy,raw){if(MOB&&!raw){z=1+(z-1)*.35;fx=.5+(fx-.5)*.35;fy=.5+(fy-.5)*.35}return {scale:z,xPercent:(.5-fx*z)*100,yPercent:(.5-fy*z)*100}}
      gsap.set(cam,shot(.9,.5,.5));
      var rms=$$('#roomsLayer .rm'),rimg=$$('#roomsLayer .rm img');
      gsap.set(rms,{opacity:0});gsap.set('#roomsLayer .rscrim',{opacity:0});gsap.set('#canvas',{opacity:1});gsap.set('.fr3,.fr4,.fr5,.fr6,.fr7',{opacity:0});gsap.set(rimg,{scale:1.18});
      var T=gsap.timeline({defaults:{ease:'none'}});
      var C=function(t,z,fx,fy,d,e,raw){T.to(cam,Object.assign(shot(z,fx,fy,raw),{duration:d||.8,ease:e||'power2.inOut'}),t)};
      T.addLabel('p0',0)
        .to('.b-head',{autoAlpha:0,y:-30,duration:.35,ease:'power2.in'},0.05)
        .to('#bMini',{opacity:1,duration:.3},.35)
        .to(ow,{strokeDashoffset:0,duration:.7,ease:'power2.inOut'},0.1)
        .to('#plan2d .dims',{opacity:1,duration:.3},.6);
      C(.1,1,.5,.5);
      T.addLabel('p1',1)
        .to(pw,{strokeDashoffset:0,duration:.55,ease:'power2.inOut'},1.1)
        .to('#plan2d .gp,#plan2d .dr',{opacity:1,duration:.25},1.5)
        .to('#plan2d .rf',{opacity:.1,duration:.35,stagger:.05},1.45)
        .to('#plan2d .lbls',{opacity:1,duration:.3},1.6);
      C(1.1,1.22,.6,.52);
      T.addLabel('p2',2)
        .to('#plan2d .dims,#plan2d .lbls',{opacity:0,duration:.2},2.05)
        .to(morph,{t:1,duration:.6,ease:'power2.inOut',onUpdate:applyMorph},2.1)
        .fromTo(gridLines,{opacity:1},{opacity:0,duration:.4,immediateRender:false,stagger:{each:.004,from:'edges'}},2.15)
        .to(tl3,{strokeDashoffset:0,duration:.4,stagger:{each:.004},ease:'power1.inOut'},2.45)
        .to('#plan2d',{opacity:0,duration:.3},2.6);
      C(2.05,1.02,.52,.5);
      T.addLabel('p3a',3)
        .to('.fr3',{opacity:1,duration:.6,ease:'power1.inOut'},3.1)
        .to('#lines',{opacity:0,duration:.4},3.45);
      C(3.1,1.08,.52,.5);
      T.addLabel('p3',4)
        .fromTo('.fr4',{opacity:0},{opacity:1,duration:.7,ease:'power1.inOut'},4.1);
      C(4.1,1.55,.42,.47);
      T.addLabel('p4',5)
        .fromTo('.fr5',{opacity:0},{opacity:1,duration:.7,ease:'power1.inOut'},5.1);
      C(5.1,1.7,.4,.44);
      T.addLabel('p5',6)
        .fromTo('.fr6',{opacity:0},{opacity:1,duration:.7,ease:'power1.inOut'},6.1);
      C(6.1,1.65,.66,.33);
      T.addLabel('p6',7)
        .to('.fr7',{opacity:1,duration:.75,ease:'power1.inOut'},7.1)
        .to('.fr3,.fr4,.fr5,.fr6',{opacity:0,duration:.5,ease:'power1.in'},7.35)
        .to(section,{'--bb':'#7B6757','--bt':'#F1ECE2','--bt2':'#D3C9B9',duration:.75,ease:'power1.inOut'},7.1);
      C(7.1,1.04,.52,.5);
      T.addLabel('p7',8);
      /* dive into the living room */
      C(8.05,MOB?2.6:3.6,.43,.45,.9,'power2.in',true);
      T.to('#bMini',{opacity:0,duration:.3},8.1)
        .to(rms[0],{opacity:1,duration:.45,ease:'power1.inOut'},8.5)
        .to(rimg[0],{scale:1.04,duration:.5,ease:'power2.out'},8.5)
        .to('#roomsLayer .rscrim',{opacity:1,duration:.4},8.6)
        .to('#canvas',{opacity:0,duration:.25},8.9)
       .addLabel('r0',9);
      /* walk through rooms */
      for(var k=1;k<rms.length;k++){
        var t0=8+k+.05;
        T.to(rimg[k-1],{scale:1.16,xPercent:k%2?-4:4,duration:.85,ease:'power2.in'},t0)
         .to(rms[k],{opacity:1,duration:.55,ease:'power1.inOut'},t0+.3)
         .fromTo(rimg[k],{scale:1.22,xPercent:k%2?5:-5},{scale:1.04,xPercent:0,duration:.65,ease:'power2.out'},t0+.3)
         .set(rms[k-1],{opacity:0},t0+.86)
         .addLabel('r'+k,9+k);
      }
      T.eventCallback('onUpdate',()=>{if(T.time()<2.15&&intro.progress()>.99)gsap.set(gridLines,{opacity:1});setStage(stageAtTime(T.time()));});window.__T=T;
      // ScrollTrigger can render the scrub tween with suppressed callbacks at snap stops.
      // Read the committed timeline time on the next GSAP tick as well.
      const syncCaption=()=>setStage(stageAtTime(T.time()));gsap.ticker.add(syncCaption);removers.push(()=>gsap.ticker.remove(syncCaption));
      ScrollTrigger.create({id:'interior-build',trigger:'#buildPin',start:'top top',end:'+='+Math.round(T.duration()*60)+'%',pin:true,scrub:match.conditions.mobile?.3:.5,anticipatePin:1,animation:T,
        snap:{snapTo:value=>navigating?value:gsap.utils.snap(Object.values(T.labels).map(time=>time/T.duration()),value),duration:{min:.2,max:.45},delay:.05,ease:'power2.inOut',inertia:false,onStart:self=>{if(navigating){self.getTween(true)?.kill?.();return;}lenis?.stop()},onInterrupt:()=>{if(!navigating)lenis?.start()},onComplete:()=>{if(!navigating)lenis?.start()}}});
      listen(window,'resize',function(){fit();applyMorph()});
      const stageLabels=['p0','p1','p2','p3','p4','p5','p6','p7','r0'];
      listen(section,'click',event=>{const button=event.target.closest('.b-list button,[data-room-step]');if(!button)return;const st=ScrollTrigger.getById('interior-build');st.getTween(true)?.kill?.();const label=button.hasAttribute('data-room-step')?'r'+Math.max(0,Math.min(5,cur-8+Number(button.dataset.roomStep))):stageLabels[Number(button.dataset.stage)];const time=T.labels[label];const target=st.start+(time/T.duration())*(st.end-st.start)+.1;if(lenis){lenis.start();navigating=true;lenis.scrollTo(target,{duration:.9,onComplete:()=>{navigating=false}});}else window.scrollTo({top:target,behavior:'smooth'});});
    
  },section);
  const refresh=()=>ScrollTrigger.refresh();document.fonts?.ready.then(refresh);listen(window,'load',refresh);
  const resize=new ResizeObserver(()=>ScrollTrigger.refresh());document.querySelectorAll('details').forEach(el=>resize.observe(el));
  return()=>{gsap.killTweensOf($$('#bStage .st'));context.revert();lenis?.start();resize.disconnect();removers.splice(0).forEach(fn=>fn());if(raf)gsap.ticker.remove(raf);lenis?.destroy();section.classList.remove('build-motion');section.querySelectorAll('.b-list button').forEach(b=>b.disabled=true);section.querySelectorAll('.st').forEach(el=>el.removeAttribute('aria-hidden'));delete section.dataset.stage;delete window.__T;delete window.__lenis;};
 });
 return()=>media.revert();
}


