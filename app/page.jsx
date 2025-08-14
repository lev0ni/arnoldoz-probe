'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import InlineSVG from '../components/InlineSVG';
import { CLOSE_TOKENS } from '../lib/routeMap';

function idOf(node){ while(node && node !== document && node.getAttribute){ const id = node.getAttribute('id'); if(id) return id; node = node.parentNode; } return null; }
async function fetchJSON(p){ const r = await fetch(p); if(!r.ok) return null; try { return await r.json(); } catch { return null; } }

export default function Page(){
  const [manifest, setManifest] = useState(null);
  const [stack, setStack] = useState([]);
  useEffect(()=>{ fetchJSON('/manifest.json').then(setManifest); },[]);

  const mainCandidate = useMemo(()=>{
    const list = manifest?.svgs?.map(f=>f.replace(/\.svg$/,'')) || [];
    return list.slice().sort()[0] || 'main';
  },[manifest]);

  const openModal = useCallback((basename)=> setStack(prev => [...prev, basename]), []);
  const closeTop = useCallback(()=> setStack(prev => prev.slice(0,-1)), []);

  const onMainClick = useCallback((e)=>{
    const id = (idOf(e.target) || '').trim();
    if(!id) return;
    const m = id.match(/^btn-(.+)$/i);
    if(m){ openModal(m[1]); }
  },[openModal]);

  const onModalClick = useCallback((current)=>(e)=>{
    const id = (idOf(e.target) || '').trim().toLowerCase();
    if(id && CLOSE_TOKENS.some(t => id.includes(t))){ closeTop(); return; }
    const m = id && id.match(/^btn-(.+)$/i);
    if(m){ openModal(m[1]); return; }
    if(id && (id.startsWith('row-') || id.includes('table-row') || id.includes('crm-row'))){
      const has = manifest?.svgs?.some(f => f.replace(/\.svg$/,'') === 'crm-card-modal');
      if(has) openModal('crm-card-modal');
    }
  },[closeTop, openModal, manifest]);

  const onOverlayClick = useCallback((e)=>{ if(e.target.classList.contains('overlay')) closeTop(); },[closeTop]);

  return (
    <div className="container">
      <div className="phone-frame">
        <InlineSVG name={mainCandidate} className="main-canvas" onClick={onMainClick} />
        {stack.map((modal, idx)=>(
          <div key={idx} className="overlay" onClick={onOverlayClick}>
            <div className="modal-wrap">
              <InlineSVG name={modal} className="modal-canvas" onClick={onModalClick(modal)} />
            </div>
          </div>
        ))}
        <div className="click-hint">tap elements by id</div>
      </div>
    </div>
  );
}
