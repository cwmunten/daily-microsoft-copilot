import type { Metadata } from 'next';
import './globals.css';
import './copilot-theme.css';
import './scene.css';

export const metadata: Metadata = {
  title: 'Advantive daily Copilot news',
  description: 'Dagelijkse Nederlandstalige update over Microsoft Copilot van Advantive.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
