'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import InlineSVG from '../components/InlineSVG';
import { CLOSE_TOKENS } from '../lib/routeMap';
import { FORCED_ROUTES } from '../lib/forcedRoutes';

function idOf(node){ while(node && node !== document && node.getAttribute){ const id = node.getAttribute('id'); if(id) return id; node = node.parentNode; } return null; }
async function fetchJSON(p){ const r = await fetch(p); if(!r.ok) return null; try { return await r.json(); } catch { return null; } }

export default function Page(){
  const [manifest, setManifest] = useState({ svgs: [] });
  const [stack, setStack] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(()=>{ fetchJSON('/api/manifest').then(m => setManifest(m || { svgs: [] })); },[]);

  const files = useMemo(()=> (manifest?.svgs || []).map(f=>f.replace(/\.svg$/,'')).sort(), [manifest]);

  const mainCandidate = useMemo(()=>{
    if(!files.length) return 'main';
    const pref = ['0-main', '00-main', '000-main', 'main-screen', 'main scrern', 'main-scrern', 'main', 'home', 'start'];
    for(const p of pref){
      const f = files.find(x => x.toLowerCase() === p.toLowerCase());
      if(f) return f;
    }
    return files[0];
  },[files]);

  const ensureExists = useCallback((name)=> files.includes(name), [files]);

  const heuristicResolve = useCallback((name) => {
    const n = (name || '').toLowerCase();
    const hay = files;
    const find = (kw) => hay.find(f => f.toLowerCase().includes(kw));
    // chat heuristics
    if (['dialogs','socials','social','dialog'].includes(n)) {
      return find('social') || find('dialogs') || find('modal-chat-social') || null;
    }
    if (['answer','answers','question','qa'].includes(n)) {
      return find('question') || find('qa') || null;
    }
    if (['attach-file','open-add-modal','add','attach','add-file','add-image'].includes(n)) {
      return find('add-files') || find('add-file') || find('add-image') || find('add') || null;
    }
    return null;
  }, [files]);

  const openModal = useCallback((basename)=>{
    if(!basename) return;
    let target = basename;
    if(!ensureExists(target)){
      const alt = heuristicResolve(target);
      if (alt && ensureExists(alt)) target = alt; else {
        setToast(`Файл не найден: ${basename}.svg`);
        setTimeout(()=> setToast(''), 2000);
        return;
      }
    }
    setStack(prev => [...prev, target]);
  },[ensureExists, heuristicResolve]);

  const closeTop = useCallback(()=> setStack(prev => prev.slice(0,-1)), []);

  const onMainClick = useCallback((e)=>{
    const id = (idOf(e.target) || '').trim();
    if(!id) return;
    const m = id.match(/^btn-(.+)$/i);
    if(m){ const bid = m[0]; const forced = FORCED_ROUTES[bid]; openModal(forced || m[1]); }
  },[openModal]);

  const onModalClick = useCallback((current)=>(e)=>{
    const id = (idOf(e.target) || '').trim().toLowerCase();
    if(!id) return;
    if (CLOSE_TOKENS.some(t => id.includes(t)) || /^btn-(close|back)$/i.test(id)) { closeTop(); return; }
    const m = id.match(/^btn-(.+)$/i);
    if(m){ 
      let target = FORCED_ROUTES[m[0]] || m[1];
      if(/^(close|back|назад|крест)$/.test(target)) { closeTop(); return; }
      openModal(target); 
      return; 
    }
    if(id.startsWith('row-') || id.includes('table-row') || id.includes('crm-row')){
      if(ensureExists('crm-card-modal')) openModal('crm-card-modal');
    }
  },[closeTop, openModal, ensureExists]);

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
