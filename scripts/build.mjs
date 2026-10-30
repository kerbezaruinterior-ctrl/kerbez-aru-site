import {build,createServer} from 'vite';import react from '@vitejs/plugin-react';import fs from 'node:fs/promises';
const config={root:'source',base:'./',publicDir:false,plugins:[react()],build:{outDir:'../.build',emptyOutDir:true}};
await build(config);
const server=await createServer({...config,server:{middlewareMode:true},appType:'custom'});
try{const {App}=await server.ssrLoadModule('/src/App.jsx');const React=await import('react');const {renderToString}=await import('react-dom/server');const html=renderToString(React.createElement(App));let template=await fs.readFile('.build/index.html','utf8');template=template.replace('<!--vendor-scripts-->',['gsap.min.js','ScrollTrigger.min.js','SplitText.min.js','lenis.min.js'].map(file=>`<script src="./vendor/${file}"></script>`).join('')).replace('<!--ssr-outlet-->',html).replaceAll('../vendor/','./vendor/');await fs.writeFile('index.html',template);await fs.cp('.build/assets','assets',{recursive:true});}finally{await server.close()}
console.log('Static root index.html generated with full content; local assets and vendor scripts.');
