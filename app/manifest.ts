import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Advantive daily Copilot news',
    short_name: 'Daily Copilot',
    description: 'Dagelijkse Nederlandstalige Microsoft Copilot-updates van Advantive.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8f8',
    theme_color: '#f7faff',
    lang: 'nl-NL',
    icons: [
      { src: '/daily-copilot-icon.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/daily-copilot-icon.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
