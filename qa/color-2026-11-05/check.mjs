import {chromium} from 'file:///C:/Users/STRIX/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:"chrome"});const results=[];
for(const width of [1440,780,390]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4174/?v=color-fix#trial-lesson');await page.evaluate(()=>document.fonts.ready);await page.locator('#trial-lesson').scrollIntoViewIfNeeded();
 const state=await page.evaluate(()=>{const color=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const bg=lum(color(getComputedStyle(document.querySelector('#trial-lesson')).backgroundColor));return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,text:[...document.querySelectorAll('#trial-lesson .eyebrow,#trial-lesson h2,#trial-lesson .trial-lead,#trial-lesson .trial-format,#trial-lesson .trial-copy>p')].map(e=>{const c=getComputedStyle(e).color,l=lum(color(c));return {text:e.textContent.slice(0,45),color:c,contrast:(Math.max(l,bg)+.05)/(Math.min(l,bg)+.05)}})}});
 if(state.overflow||state.text.some(e=>e.contrast<4.5)||errors.length)throw Error(JSON.stringify({state,errors}));
 await page.screenshot({path:`qa/color-2026-11-05/trial-${width}.png`});results.push({...state,errors});await page.close();
}
await fs.writeFile('qa/color-2026-11-05/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();


