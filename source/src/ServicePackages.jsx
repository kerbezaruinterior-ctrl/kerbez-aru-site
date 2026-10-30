import {useRef,useState} from 'react';

const packages=[
 {name:'Экспресс проект',price:'5 000',items:['Обмер помещения','Обмерный план','План расстановки мебели','План демонтажа','План монтажа','План сантехники','План полов','План развертки ванной комнаты','План и схема освещения','План электрики','Ведомость отделки']},
 {name:'Чертежи + визуализация',price:'от 17 000',items:['Обмер помещения','Согласование и утверждение расстановки мебели','3Д-визуализация','Обмерный план','План демонтажа','План монтажа','Кладочный план после перепланировки','План сантехнического оборудования','Планировочное решение','План полов','План тёплых полов','План открывания дверей','План потолков','План карнизов','План освещения','Схема освещения','План электрики','Ведомость отделки','Развёртки стен по комнатам','План деревянных шкафов']},
 {name:'Сопровождение',price:'от 25 000',items:['Обмер помещения','Согласование и утверждение расстановки мебели','3Д-визуализация','Чертежи с развёртками стен','Авторское сопровождение проекта','Комплектация до чистовой отделки']}
];

export default function ServicePackages(){
 const [active,setActive]=useState(0);
 const tabs=useRef([]);
 function onKeyDown(event,index){
  let next;
  if(event.key==='ArrowRight')next=(index+1)%packages.length;
  if(event.key==='ArrowLeft')next=(index+packages.length-1)%packages.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=packages.length-1;
  if(next!==undefined){event.preventDefault();setActive(next);tabs.current[next].focus()}
 }
 return <section id="services" className="services section-pad" aria-labelledby="services-title">
  <div className="section-heading reveal"><p className="eyebrow">УСЛУГИ</p><span>KERBEZ ARU INTERIOR DESIGN</span></div>
  <h2 id="services-title" className="reveal">Три пакета.<br/><em>Ваше пространство.</em></h2>
  <div className="package-tabs" role="tablist" aria-label="Пакеты услуг">{packages.map((item,index)=><button key={item.name} ref={el=>{tabs.current[index]=el}} id={`package-tab-${index}`} type="button" role="tab" aria-selected={active===index} aria-controls={`package-panel-${index}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>onKeyDown(event,index)}><span className="package-number">0{index+1}</span>{item.name}</button>)}</div>
  {packages.map((item,index)=><div className="package-panel" key={item.name} id={`package-panel-${index}`} role="tabpanel" aria-labelledby={`package-tab-${index}`} hidden={active!==index} tabIndex="0">
   <div className="package-summary"><p className="eyebrow">ПАКЕТ 0{index+1}</p><h3>{item.name}</h3><p className="package-price">{item.price} <span>тг/м²</span></p><a className="manager-link" href={'https://wa.me/77054659807?text='+encodeURIComponent(`Здравствуйте! Меня интересует пакет «${item.name}» (${item.price} тг/м²). Хочу обсудить проект с менеджером.`)} target="_blank" rel="noopener noreferrer">Связаться с менеджером <span aria-hidden="true">↗</span></a><p className="package-whatsapp">WhatsApp · +7 705 465 98 07</p></div>
   <div className="package-details"><p className="eyebrow">ЧТО ВХОДИТ?</p><ol>{item.items.map(text=><li key={text}>{text}</li>)}</ol></div>
  </div>)}
 </section>;
}
