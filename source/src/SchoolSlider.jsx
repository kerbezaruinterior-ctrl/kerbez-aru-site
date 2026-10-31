import {useRef,useState} from 'react';
const schoolPhotos=[['studio','Команда школы с материалами и проектами','./assets/team-7622.webp'],['group','Группа Kerbez Aru Interior School с планами на объекте'],['0789','Разбор планировки на занятии'],['0647','Обучение в аудитории'],['0708','Группа школы на занятии'],['1051','Выездное занятие на объекте'],['1187','Знакомство с материалами в шоуруме'],['1183','Практическое занятие на объекте'],['1353','Работа над проектами в аудитории'],['1547','Обсуждение плана на объекте'],['1706','Выбор материалов и отделки'],['1741','Индивидуальный разбор проекта'],['9477','Группа Kerbez Aru Interior School на выездном занятии']];
export default function SchoolSlider({slides=schoolPhotos,prefix='school',label='обучения',caption='KERBEZ ARU INTERIOR SCHOOL'}){
 const photos=slides;
 const [index,setIndex]=useState(0),[direction,setDirection]=useState(1);
 const touch=useRef(null);
 function move(delta){setDirection(delta);setIndex(current=>(current+delta+photos.length)%photos.length)}
 function select(next){setDirection(next>=index?1:-1);setIndex(next)}
 return <div className="school-slider reveal" role="region" aria-roledescription="карусель" aria-label={`Фотографии ${label} Kerbez Aru`} tabIndex="0" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}}>
  <figure className="school-photo" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchCancel={()=>{touch.current=null}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)}}>
   <img key={index} className={direction>0?'slide-forward':'slide-back'} src={photos[index][2]||`./assets/${prefix}-${photos[index][0]}.webp`} width="1800" height="2400" loading="lazy" decoding="async" alt={photos[index][1]}/>
   <figcaption>{caption}</figcaption>
  </figure>
  <div className="school-slide-controls"><button type="button" onClick={()=>move(-1)} aria-label={`Предыдущее фото ${label}`}>←</button><p aria-live="polite" aria-atomic="true">{index+1} <span>/ {photos.length}</span></p><button type="button" onClick={()=>move(1)} aria-label={`Следующее фото ${label}`}>→</button></div>
  <div className="school-slide-dots" aria-label="Выбрать фотографию">{photos.map(([id],i)=><button key={id} type="button" aria-label={`Фото ${label} ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>select(i)}><span/></button>)}</div>
 </div>;
}
