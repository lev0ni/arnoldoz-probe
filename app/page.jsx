'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import InlineSVG from '../components/InlineSVG';
import { SPEC_ROUTES, CLOSE_TOKENS } from '../lib/routeMap';

function normalize(s='') { return (s||'').toString().trim(); }
function idOf(node) {
  while (node && node !== document && node.getAttribute) {
    const id = node.getAttribute('id');
    if (id) return id;
    node = node.parentNode;
  }
  return null;
}

async function fetchJSON(path) {
  const r = await fetch(path);
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}

export default function Page() {
  const [manifest, setManifest] = useState(null);
  const [nameMap, setNameMap] = useState(null);
  const [stack, setStack] = useState([]); // modal stack of names (basenames)

  // pick main screen best-effort
  const mainCandidate = useMemo(() => {
    if (!manifest) return 'main-scrern'; // user spelling
    const list = manifest.svgs?.map(f => f.replace(/\.svg$/,'')).filter(Boolean) || [];
    const pri = ['main-scrern','main-screen','main','home','start'];
    for (const p of pri) {
      const found = list.find(x => x.toLowerCase() === p.toLowerCase());
      if (found) return found;
    }
    // fallback first svg
    return list[0] || 'main-screen';
  }, [manifest]);

  useEffect(() => {
    fetchJSON('/manifest.json').then(setManifest);
    fetchJSON('/name-map.json').then(setNameMap);
  }, []);

  const resolveName = useCallback((logical) => {
    if (!logical) return null;
    const n = logical.trim();
    if (nameMap && nameMap[n]) return nameMap[n];
    return n;
  }, [nameMap]);

  const openModal = useCallback((logicalName) => {
    const actual = resolveName(logicalName);
    if (!actual) return;
    setStack(prev => [...prev, actual]);
  }, [resolveName]);

  const closeTop = useCallback(() => {
    setStack(prev => prev.slice(0, -1));
  }, []);

  const onMainClick = useCallback((e) => {
    const id = idOf(e.target);
    const clean = normalize(id).toLowerCase();
    if (!clean) return;
    // direct map from main screen
    if (SPEC_ROUTES[clean]) {
      openModal(SPEC_ROUTES[clean]);
      return;
    }
    // generic close/back not applied on main
  }, [openModal]);

  const onModalClick = useCallback((currentModal) => (e) => {
    const id = idOf(e.target);
    const clean = normalize(id).toLowerCase();
    // close/back
    if (clean && CLOSE_TOKENS.some(t => clean.includes(t))) {
      closeTop();
      return;
    }
    // specific logic per current modal
    if (currentModal && currentModal.toLowerCase().includes('crm') && clean) {
      // if clicked a row-like id
      if (clean.startsWith('row-') || clean.includes('table-row') || clean.includes('crm-row')) {
        const next = SPEC_ROUTES['__crm_row_click__'];
        openModal(next);
        return;
      }
    }
    // general routing by SPEC_ROUTES
    if (clean && SPEC_ROUTES[clean]) {
      openModal(SPEC_ROUTES[clean]);
      return;
    }
  }, [openModal, closeTop]);

  const onOverlayClick = useCallback((e) => {
    if (e.target.classList.contains('overlay')) {
      closeTop();
    }
  }, [closeTop]);

  return (
    <div className="container">
      <div className="phone-frame">
        <InlineSVG name={mainCandidate} className="main-canvas" onClick={onMainClick} />
        {stack.map((modal, idx) => (
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
