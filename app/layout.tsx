import type { Metadata, Viewport } from 'next';
import './globals.css';
import './copilot-theme.css';
import './scene.css';

export const metadata: Metadata = {
  title: 'Advantive daily Copilot news',
  description: 'Dagelijkse Nederlandstalige update over Microsoft Copilot van Advantive.',
  applicationName: 'Advantive daily Copilot news',
  icons: {
    icon: [
      { url: '/daily-copilot-icon.png', type: 'image/png' },
      { url: '/daily-copilot-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/daily-copilot-icon.png',
    apple: [
      { url: '/daily-copilot-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Daily Copilot',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7faff',
};

// Daily Copilot production build: Supabase-backed persistent news archive.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
