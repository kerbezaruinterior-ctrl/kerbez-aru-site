from pathlib import Path
import re
html=Path('index.html').read_text(encoding='utf-8')
html=html.replace('src="./','src="../').replace('href="./','href="../')
Path('qa/no-js.html').write_text(re.sub(r'<script\b[^>]*>.*?</script>','',html,flags=re.S),encoding='utf-8')
shim="""<script>const originalMatchMedia=window.matchMedia.bind(window);window.matchMedia=q=>q.includes('prefers-reduced-motion')?{media:q,matches:!q.includes('no-preference'),addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return true}}:originalMatchMedia(q);</script><style>*{animation:none!important;transition:none!important;scroll-behavior:auto!important}</style>"""
Path('qa/reduced-motion.html').write_text(html.replace('<head>','<head>'+shim),encoding='utf-8')
