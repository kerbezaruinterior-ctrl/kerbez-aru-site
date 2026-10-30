import {memo,useEffect} from 'react';
import markup from './build-markup.json';import {initBuild} from './build-motion';import './build.css';
const content={__html:markup};
export default memo(function BuildExperience(){useEffect(()=>{let disposed=false,cleanup;const start=()=>{if(!disposed)cleanup=initBuild()};if(document.fonts)document.fonts.ready.then(start);else start();return()=>{disposed=true;cleanup?.()};},[]);return <div className="build-experience" dangerouslySetInnerHTML={content}/>});
