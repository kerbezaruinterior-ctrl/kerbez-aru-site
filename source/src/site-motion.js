import {useEffect} from 'react';

/** Editorial motion complements the apartment scene; it never owns #build. */
export function useSiteMotion(){
 useEffect(()=>{
  let disposed=false,dispose;
  const start=()=>{if(!disposed)dispose=initSiteMotion()};
  if(document.fonts)document.fonts.ready.then(start);else start();
  return()=>{disposed=true;dispose?.()};
 },[]);
}

export function initSiteMotion(){
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
 if(!gsap||!ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const main=document.querySelector('main'),media=gsap.matchMedia();
 const listeners=[];const listen=(node,type,fn,options)=>{node.addEventListener(type,fn,options);listeners.push(()=>node.removeEventListener(type,fn,options))};
 // Navigation stays useful even when all motion is disabled.
 const sections=['home','build','projects','services','studio','lessons','student-projects','reviews','photo-reviews','trial-lesson','contact'].map(id=>document.getElementById(id)).filter(Boolean);
 let navFrame=0;
 const updateNav=()=>{navFrame=0;const line=innerHeight*.32;let id='home';for(const section of sections){const r=section.getBoundingClientRect();if(r.top<=line)id=section.id;}if(['student-projects','photo-reviews','trial-lesson'].includes(id))id=id==='photo-reviews'?'reviews':'lessons';document.querySelectorAll('.header nav a, .mobile-nav a').forEach(a=>{const current=a.hash==='#'+id;a.toggleAttribute('data-current',current);if(current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});};
 const requestNav=()=>{if(!navFrame)navFrame=requestAnimationFrame(updateNav)};
 listen(window,'scroll',requestNav,{passive:true});listen(window,'resize',requestNav);listen(document,'click',requestNav);updateNav();
 media.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width:901px)',mobile:'(max-width:900px)'},match=>{
  if(!match.conditions.motion)return;
  const desktop=match.conditions.desktop,targets=new Set(),tweens=new Set();let refreshFrame=0;
  const track=t=>{tweens.add(t);return t};
  const context=gsap.context(()=>{
   gsap.to('.reading-progress',{scaleX:1,ease:'none',scrollTrigger:{id:'editorial-progress',start:0,end:'max',scrub:.2}});
   // One short entrance, then the hero photograph gently changes perspective with scroll.
   gsap.fromTo('.hero-content > :not(.hero-signature)',{opacity:0,y:20},{opacity:1,y:0,duration:.95,stagger:.09,ease:'power3.out',clearProps:'opacity,transform'});
   if(desktop)gsap.fromTo('.hero-image',{scale:1.04,yPercent:0},{scale:1.1,yPercent:3,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:1}});
   const images=desktop?document.querySelectorAll('.wide-photo img,.portrait img'):[];
   images.forEach(img=>gsap.fromTo(img,{yPercent:-2,scale:1.07},{yPercent:2,scale:1.07,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
  });
  const selector='main h2, .section-heading, .wide-photo, .portrait, .school-slider, .review-carousel, .photo-review-carousel, .audience-grid article, .process-grid article, .direction-links > a, .student-album, .gallery-photo, .templates-benefits li, .career-services li, .course-support-list li, .trial-copy, #contact form, .our-projects-panel > summary, .student-project-panel > summary, .revit-program > details > summary, .online-overview';
  // IntersectionObserver follows the *rendered* page, including the pinned build scene
  // and content revealed later in details. Nothing is split or rewritten in React's DOM.
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;const el=entry.target;observer.unobserve(el);el.dataset.motionState='visible';
   const line=el.classList.contains('section-heading');
   track(gsap.to(el,line?{'--rule-progress':1,duration:1.1,ease:'power2.inOut'}:{opacity:1,y:0,clipPath:'inset(0% 0% 0% 0%)',duration:el.tagName==='H2'?1.05:.8,delay:Number(el.dataset.motionDelay||0),ease:'power3.out',onComplete:()=>{gsap.set(el,{clearProps:'opacity,transform,clipPath'});tweens.forEach(t=>{if(!t.isActive())tweens.delete(t)})}}));
  }),{threshold:0,rootMargin:'0px 0px -6% 0px'});
  function prepare(){
   document.querySelectorAll(selector).forEach(el=>{
    if(targets.has(el)||el.closest('#build,dialog')||el.closest('details:not([open])')&&!el.matches('summary'))return;
    if(el.closest('[hidden]'))return;
    targets.add(el);el.dataset.motionState='pending';
    // Small column delays only, never an increasing delay down a long list.
    const siblings=[...el.parentElement.children];const column=siblings.indexOf(el)%(desktop?3:1);
    el.dataset.motionDelay=String(column*.06);
    if(el.classList.contains('section-heading')){el.classList.add('motion-rule');gsap.set(el,{'--rule-progress':0});}
    else gsap.set(el,{opacity:0,y:desktop?26:14,clipPath:el.tagName==='H2'?'inset(0% 0% 10% 0%)':'inset(0% 0% 0% 0%)'});
    observer.observe(el);
   });
  }
  prepare();
  // DOM discovery must not refresh ScrollTrigger: pin refresh itself mutates the DOM.
  const refresh=()=>{if(refreshFrame)return;refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;prepare();requestNav()})};
  const mutations=new MutationObserver(refresh);mutations.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open']});
  const focus=e=>{const target=e.target.closest('[data-motion-state="pending"]');if(target){observer.unobserve(target);gsap.killTweensOf(target);gsap.set(target,{clearProps:'opacity,transform,clipPath'});target.dataset.motionState='visible'}};
  main.addEventListener('focusin',focus);
  return()=>{observer.disconnect();mutations.disconnect();main.removeEventListener('focusin',focus);cancelAnimationFrame(refreshFrame);context.revert();tweens.forEach(t=>t.kill());targets.forEach(el=>{gsap.killTweensOf(el);gsap.set(el,{clearProps:'opacity,transform,clipPath,--rule-progress'});el.classList.remove('motion-rule');delete el.dataset.motionState;delete el.dataset.motionDelay;});};
 });
 return()=>{media.revert();listeners.forEach(fn=>fn());cancelAnimationFrame(navFrame);document.querySelectorAll('[data-current]').forEach(a=>{a.removeAttribute('data-current');a.removeAttribute('aria-current')})};
}
