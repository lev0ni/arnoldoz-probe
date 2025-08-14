'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import InlineSVG from '../components/InlineSVG';
import { CLOSE_TOKENS } from '../lib/routeMap';

function idOf(node){ while(node && node !== document && node.getAttribute){ const id = node.getAttribute('id'); if(id) return id; node = node.parentNode; } return null; }
async function fetchJSON(p){ const r = await fetch(p); if(!r.ok) return null; try { return await r.json(); } catch { return null; } }

export default function Page(){
  const [manifest, setManifest] = useState(null);
  const [stack, setStack] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(()=>{
    fetch('/manifest.json').then(r=>r.json()).then(setManifest).catch(()=>setManifest({svgs:[]}));
  },[]);

  const files = useMemo(()=> (manifest?.svgs || []).map(f=>f.replace(/\.svg$/,'')).sort(), [manifest]);

  const mainCandidate = useMemo(()=>{
    if(!files.length) return 'main';
    const pref = ['0-main','main-scrern','main-screen','main','home','start'];
    for(const p of pref){ const f = files.find(x => x.toLowerCase() === p.toLowerCase()); if(f) return f; }
    return files[0];
  },[files]);

  const openModal = useCallback((basename)=>{
    if(!basename) return;
    const target = basename.toString().trim();
    if(!files.includes(target)){
      setToast(`Файл не привязан: ${target}.svg`);
      setTimeout(()=> setToast(''), 1800);
      return;
    }
    setStack(prev => [...prev, target]);
  },[files]);

  const closeTop = useCallback(()=> setStack(prev => prev.slice(0,-1)), []);

  const onMainClick = useCallback((e)=>{
    const id = (idOf(e.target) || '').trim();
    if(!id) return;
    const m = id.match(/^btn-(.+)$/i);
    if(m){ openModal(m[1]); }
  },[openModal]);

  const onModalClick = useCallback((current)=>(e)=>{
    const id = (idOf(e.target) || '').trim().toLowerCase();
    if(!id) return;
    if (CLOSE_TOKENS.some(t => id.includes(t)) || /^btn-(close|back)$/i.test(id)) { closeTop(); return; }
    const m = id.match(/^btn-(.+)$/i);
    if(m){ 
      const tgt = m[1];
      if(/^(close|back|назад|крест)$/.test(tgt)) { closeTop(); return; }
      openModal(tgt);
      return;
    }
    if(id.startsWith('row-') || id.includes('table-row') || id.includes('crm-row')){
      if(files.includes('crm-card-modal')) openModal('crm-card-modal'); else if (files.includes('crm-user-card')) openModal('crm-user-card');
    }
  },[closeTop, openModal, files]);

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
        {toast ? <div className="toast">{toast}</div> : null}
        <div className="click-hint">tap elements by id</div>
      </div>
    </div>
  );
}
