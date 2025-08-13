export const metadata = { title: 'ArnoldOz MiniApp', description: 'SVG-driven prototype' };
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body><div className="container">{children}</div></body>
    </html>
  );
}
