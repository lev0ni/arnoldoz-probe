
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
export default function Screen({ children, map }:{children:React.ReactNode, map:Record<string,string>}){
  const r = useRouter(); const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host = ref.current; if(!host) return;
    const onClick = (e: Event)=>{
      const el = (e.target as HTMLElement)?.closest('[id]') as HTMLElement | null;
      if(!el) return; const to = map[el.id];
      if(to){ e.preventDefault(); r.push(to); }
    };
    host.addEventListener('click', onClick);
    return ()=>host.removeEventListener('click', onClick);
  }, [map, r]);
  return <div ref={ref}>{children}</div>;
}
