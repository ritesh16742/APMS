'use client';
import {useEffect} from 'react';
// Tracks the pointer over glass surfaces so CSS can paint a soft specular highlight (--px / --py).
export default function SpatialEffects(){
  useEffect(()=>{
    const sel='.panel,.stat-card,.quick,.login-card';
    function move(e){
      const el=e.target.closest&&e.target.closest(sel);
      if(!el)return;
      const r=el.getBoundingClientRect();
      el.style.setProperty('--px',(e.clientX-r.left)+'px');
      el.style.setProperty('--py',(e.clientY-r.top)+'px');
    }
    document.addEventListener('pointermove',move,{passive:true});
    return()=>document.removeEventListener('pointermove',move);
  },[]);
  return null;
}
