import { NextResponse } from 'next/server';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const dir = join(process.cwd(), 'public', 'svg');
    const files = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.svg'));
    return NextResponse.json({ svgs: files.sort() });
  } catch (e) {
    return NextResponse.json({ svgs: [], error: String(e) }, { status: 200 });
  }
}
