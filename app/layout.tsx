import type { Metadata, Viewport } from 'next';
import './globals.css';
import './copilot-theme.css';
import './scene.css';

const appIcon='/daily-copilot-icon.png?v=2';
export const metadata: Metadata = {
  title: 'Advantive daily Copilot news',
  description: 'Dagelijkse Nederlandstalige update over Microsoft Copilot van Advantive.',
  applicationName: 'Advantive daily Copilot news',
  manifest: '/manifest.webmanifest?v=2',
  icons: {
    icon: [{ url: appIcon, sizes: '512x512', type: 'image/png' }],
    shortcut: appIcon,
    apple: [{ url: appIcon, sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: { capable: true, title: 'Daily Copilot', statusBarStyle: 'default' },
};
export const viewport: Viewport = { themeColor: '#f7faff' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {return <html lang="nl"><body>{children}</body></html>}
