import {ProjectStory} from './SignatureSections';
import {useEffect,useRef,useState} from 'react';
import photos from './projects.json';
import albums from './studio-albums.json';
import {AlbumViewer,pageUrl} from './StudentProjects';

function PhotoViewer({index,onMove,onClose}){
 const dialog=useRef(null);
 const photo=photos[index];
 useEffect(()=>{
  const previous=document.activeElement;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialog.current.showModal();
  return()=>{document.body.style.overflow=overflow;previous?.focus({preventScroll:true})};
 },[]);
 return <dialog ref={dialog} data-lenis-prevent="" className="photo-viewer" aria-label="Фотографии реализованных проектов" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();onMove(1)}if(e.key==='ArrowLeft'){e.preventDefault();onMove(-1)}}}>
  <div className="viewer-top"><p aria-live="polite">Фото {index+1} / {photos.length}</p><button autoFocus type="button" onClick={onClose} aria-label="Закрыть фотографии">Закрыть ×</button></div>
  <div className="viewer-stage"><img key={photo.id} src={photo.full} width={photo.width} height={photo.height} alt={`Реализованный интерьер Kerbez Aru — фото ${index+1}`}/></div>
  <div className="viewer-bottom"><button type="button" onClick={()=>onMove(-1)} aria-label="Предыдущее фото">← Назад</button><span>KERBEZ ARU · ПРОЕКТЫ</span><button type="button" onClick={()=>onMove(1)} aria-label="Следующее фото">Далее →</button></div>
 </dialog>;
}

export default function ProjectGallery(){
 const [expanded,setExpanded]=useState(false);
 const [album,setAlbum]=useState(null);const albumTrigger=useRef(null);
 const [active,setActive]=useState(null);
 const shown=expanded?photos:photos.slice(0,9);
 const move=delta=>setActive(current=>(current+delta+photos.length)%photos.length);
 return <section id="projects" className="section-pad projects" aria-labelledby="projects-title">
  <div className="section-heading reveal"><p className="eyebrow">01 / ПРОЕКТЫ</p><span>Форма. Свет. Ощущения.</span></div>
  <div className="curated-projects"><button onClick={e=>{albumTrigger.current=e.currentTarget;setAlbum(albums[0])}}><img src="./assets/studio-albums/cupid/page-03.jpg" loading="lazy" alt="Гостиная Cupid’s apartment"/><span>Cupid’s apartment <b>↗</b></span><small>Визуализации · альбом проекта</small></button><button onClick={e=>{albumTrigger.current=e.currentTarget;setAlbum(albums[1])}}><img src="./assets/studio-albums/almaty/page-08.jpg" loading="lazy" alt="Планировка квартиры в Алматы"/><span>Алматы <b>↗</b></span><small>Рабочие чертежи · альбом проекта</small></button><button onClick={()=>setActive(0)}><img src={photos[0].thumb} loading="lazy" alt="Светлая гостиная с мягким диваном"/><span>Интерьеры в деталях <b>↗</b></span><small>Фотогалерея студии</small></button></div>
  <ProjectStory openAlbum={e=>{albumTrigger.current=e.currentTarget;setAlbum(albums[1])}}/>
  <details className="our-projects-panel"><summary id="projects-title">Наши проекты <span aria-hidden="true">+</span></summary><div className="our-projects-content"><div className="gallery-intro"><h2>Проекты<br/><em>студии.</em></h2><p>Пространства, созданные для жизни.<br/>От общего настроения — до любимых деталей.</p></div>
  <div className="studio-project-albums"><h3>Альбомы наших проектов</h3><div className="student-albums">{albums.map(item=><button key={item.id} className="student-album" type="button" onClick={e=>{albumTrigger.current=e.currentTarget;setAlbum(item)}} aria-label={`Открыть альбом: ${item.title}`}><img src={pageUrl(item,item.cover-1)} loading="lazy" alt={item.title}/><span className="student-album-title">{item.title}<span aria-hidden="true">↗</span></span><span className="student-album-caption">{item.pages} страниц · Смотреть альбом</span></button>)}</div></div><div className="project-gallery">{shown.map((photo,index)=><button type="button" className="gallery-photo" key={photo.id} onClick={()=>setActive(index)} aria-label={`Открыть фото ${index+1} из ${photos.length}`}><img src={photo.thumb} width={photo.width} height={photo.height} alt={`Реализованный интерьер Kerbez Aru — фото ${index+1}`} loading="lazy" decoding="async"/><span className="photo-open" aria-hidden="true">Смотреть ↗</span></button>)}</div>
  <div className="gallery-footer"><p aria-live="polite">{shown.length} из {photos.length} фотографий</p><button className="text-link" type="button" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'Свернуть галерею ↑':`Все фотографии (${photos.length}) ↓`}</button><a className="text-link" href="#contact">Обсудить свой интерьер ↗</a></div>
  </div></details>
  {album&&<AlbumViewer album={album} close={()=>setAlbum(null)} trigger={albumTrigger.current}/>}
  {active!==null&&<PhotoViewer index={active} onMove={move} onClose={()=>setActive(null)}/>}
 </section>;
}
