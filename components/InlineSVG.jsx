'use client';
import { useEffect, useState, useMemo } from 'react';
export default function InlineSVG({ name, className, onClick }){
  const [markup, setMarkup] = useState(null);
  const file = useMemo(()=> `/svg/${encodeURIComponent(name)}.svg`, [name]);
  useEffect(()=>{
    let alive = true;
    fetch(file).then(r=>{ if(!r.ok) throw new Error('SVG not found'); return r.text();})
      .then(txt => { if (alive) setMarkup(txt); })
      .catch(()=> setMarkup(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 844'><rect width='100%' height='100%' fill='#18181b'/><text x='50%' y='50%' fill='#fff' text-anchor='middle' font-size='16'>Не найден файл: ${name}.svg</text></svg>`));
    return ()=>{ alive=false; };
  }, [file, name]);
  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: markup || '' }} />;
}
