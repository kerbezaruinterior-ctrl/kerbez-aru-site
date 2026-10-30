export function initBuild(){
 const section=document.getElementById('build');if(!section)return;
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger,SplitText=window.SplitText;
 if(!gsap||!ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);const hasSplit=!!SplitText;if(hasSplit)gsap.registerPlugin(SplitText);
 const $=s=>section.querySelector(s),$$=s=>Array.from(section.querySelectorAll(s));
 const removers=[];const listen=(target,type,fn)=>{target.addEventListener(type,fn);removers.push(()=>target.removeEventListener(type,fn))};
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  section.classList.add('build-motion');section.querySelectorAll('.b-list button').forEach(b=>b.disabled=false);
  let lenis=null,raf=null;
  if(window.Lenis){lenis=new window.Lenis({duration:1.25,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);raf=t=>lenis.raf(t*1000);gsap.ticker.add(raf);gsap.ticker.lagSmoothing(0);window.__lenis=lenis;}
  const anchor=e=>{const a=e.target.closest('a[href^="#"]');if(!a||!lenis)return;const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();lenis.scrollTo(target,{duration:1.6,offset:-72})}};
  listen(document,'click',anchor);
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
      function setStage(i){
        if(i===cur)return;var prev=cur;cur=i;
        lis.forEach(function(l){l.classList.toggle('on',+l.dataset.i===i);l.querySelector('button')?.setAttribute('aria-current',+l.dataset.i===i?'step':'false')});
        if(prev>=0)gsap.to(sts[prev],{autoAlpha:0,y:-24,duration:.35,ease:'power2.in',overwrite:true});
        sts.forEach(function(st,j){st.setAttribute('aria-hidden',j===i?'false':'true')});section.dataset.stage=String(i);
        gsap.fromTo(sts[i],{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.6,delay:prev>=0?.18:0,ease:'power3.out',overwrite:true});
      }

      /* intro on load: grid + title */
      var bs=hasSplit?SplitText.create('#buildTitle',{type:'words',mask:'words'}):null;
      var intro=gsap.timeline({defaults:{ease:'expo.out'},scrollTrigger:{trigger:section,start:'top 80%',once:true}});
      intro.from(bs?bs.words:'#buildTitle',{yPercent:110,duration:1.3,stagger:.06},.1)
        .from('.b-head .eyebrow',{opacity:0,y:14,duration:1},0)
        .to(gridLines,{opacity:1,duration:.8,stagger:{each:.012,from:'center'},ease:'power1.out'},.2)
        .add(function(){setStage(0)},.5)
        .from('.b-list li',{opacity:0,x:16,stagger:.05,duration:.8},.6);

      /* scroll timeline: 8 units, one per stage */
      var T=gsap.timeline({defaults:{ease:'none'}});
      T.addLabel('p0',0)
        .to(ow,{strokeDashoffset:0,duration:.7,ease:'power2.inOut'},0.1)
        .to('#plan2d .dims',{opacity:1,duration:.3},.6)
       .addLabel('p1',1)
        .to(pw,{strokeDashoffset:0,duration:.55,ease:'power2.inOut'},1.1)
        .to('#plan2d .gp,#plan2d .dr',{opacity:1,duration:.25},1.5)
        .to('#plan2d .rf',{opacity:.1,duration:.35,stagger:.05},1.45)
        .to('#plan2d .lbls',{opacity:1,duration:.3},1.6)
       .addLabel('p2',2)
        .to('#plan2d .dims,#plan2d .lbls',{opacity:0,duration:.2},2.05)
        .to(morph,{t:1,duration:.6,ease:'power2.inOut',onUpdate:applyMorph},2.1)
        .to(gridLines,{opacity:0,duration:.4,stagger:{each:.004,from:'edges'}},2.15)
        .to(tl3,{strokeDashoffset:0,duration:.4,stagger:{each:.004},ease:'power1.inOut'},2.45)
        .to('#plan2d',{opacity:0,duration:.3},2.6)
       .addLabel('p3a',3)
        .to('.fr3',{opacity:1,duration:.6,ease:'power1.inOut'},3.1)
        .to('#lines',{opacity:0,duration:.4},3.45)
       .addLabel('p3',4)
        .fromTo('.fr4',{opacity:0,scale:1.015},{opacity:1,scale:1,duration:.7,ease:'power1.inOut'},4.1)
       .addLabel('p4',5)
        .fromTo('.fr5',{opacity:0,scale:1.015},{opacity:1,scale:1,duration:.7,ease:'power1.inOut'},5.1)
       .addLabel('p5',6)
        .fromTo('.fr6',{opacity:0,scale:1.015},{opacity:1,scale:1,duration:.7,ease:'power1.inOut'},6.1)
       .addLabel('p6',7)
        .to('.fr7',{opacity:1,duration:.75,ease:'power1.inOut'},7.1)
        .to(section,{'--bb':'#7B6757','--bt':'#F1ECE2','--bt2':'#D3C9B9',duration:.75,ease:'power1.inOut'},7.1)
        .fromTo('.fr7',{scale:1},{scale:1.03,duration:.9,ease:'power1.out'},7.1)
       .addLabel('p7',8);
      window.__T=T;
      var starts=[0.05,1.05,2.05,4.05,5.05,6.05,7.05];
      ScrollTrigger.create({id:'interior-build',trigger:'#buildPin',start:'top top',end:'+='+Math.round(8*66)+'%',pin:true,scrub:1,anticipatePin:1,animation:T,
        snap:{snapTo:'labels',duration:{min:.35,max:.9},delay:.12,ease:'power2.inOut',inertia:false},
        onUpdate:function(s){var t=T.duration()*s.progress,k=0;for(var i=0;i<starts.length;i++){if(t>=starts[i])k=i+1}setStage(k)}});
      listen(window,'resize',function(){fit();applyMorph()});
      const stageLabels=['p0','p1','p2','p3','p4','p5','p6','p7'];
      $$('.b-list button').forEach(button=>listen(button,'click',()=>{const st=ScrollTrigger.getById('interior-build');const time=T.labels[stageLabels[Number(button.dataset.stage)]];const target=st.start+(time/T.duration())*(st.end-st.start)+2;if(lenis)lenis.scrollTo(target,{duration:.9});else window.scrollTo({top:target,behavior:'smooth'});}));
    
  },section);
  const refresh=()=>ScrollTrigger.refresh();document.fonts?.ready.then(refresh);listen(window,'load',refresh);
  const resize=new ResizeObserver(()=>ScrollTrigger.refresh());document.querySelectorAll('details').forEach(el=>resize.observe(el));
  return()=>{context.revert();resize.disconnect();removers.splice(0).forEach(fn=>fn());if(raf)gsap.ticker.remove(raf);lenis?.destroy();section.classList.remove('build-motion');section.querySelectorAll('.b-list button').forEach(b=>b.disabled=true);section.querySelectorAll('.st').forEach(el=>el.removeAttribute('aria-hidden'));delete section.dataset.stage;delete window.__T;delete window.__lenis;};
 });
 return()=>media.revert();
}
