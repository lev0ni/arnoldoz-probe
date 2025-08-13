'use client';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback } from 'react';

type ScreenProps = {
  Svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  routes: Record<string, string>;
  fallbackIdPrefix?: string; // optional prefix for row-* etc.
};

export default function Screen({ Svg, routes }: ScreenProps) {
  const router = useRouter();

  const onClick = useCallback((e: MouseEvent<HTMLElement>) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    // bubble up to find nearest element with id
    let el: HTMLElement | null = t;
    while (el && !el.id) el = el.parentElement;
    if (!el?.id) return;

    const id = el.id;
    // map row-* to row
    const key = id.startsWith('row-') ? 'row-*' : id;
    const dest = routes[key] ?? routes[id];
    if (dest) router.push(dest);
  }, [router, routes]);

  return (
    <div onClick={onClick} aria-label="screen">
      <Svg />
    </div>
  );
}
