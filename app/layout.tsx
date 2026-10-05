import type { Metadata, Viewport } from 'next';
import './globals.css';
import './copilot-theme.css';
import './scene.css';
import PushNotifications from './PushNotifications';

export const metadata: Metadata = {
  title: 'Advantive daily Copilot news',
  description: 'Dagelijkse Nederlandstalige update over Microsoft Copilot van Advantive.',
  applicationName: 'Advantive daily Copilot news',
  manifest: '/manifest.webmanifest?v=3',
  appleWebApp: { capable: true, title: 'Daily Copilot', statusBarStyle: 'default' },
};
export const viewport: Viewport = { themeColor: '#f7faff' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {return <html lang="nl"><body>{children}<PushNotifications/></body></html>}
