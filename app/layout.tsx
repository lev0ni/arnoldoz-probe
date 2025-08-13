
import './globals.css';
export const metadata = { title: 'ArnoldOz' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ru"><body><div className="wrapper">{children}</div></body></html>);
}
