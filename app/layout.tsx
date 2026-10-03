import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Microsoft Copilot | Advantive',
  description: 'Dagelijkse Nederlandstalige update over Microsoft Copilot.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
