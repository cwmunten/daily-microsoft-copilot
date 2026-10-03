import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Advantive daily Copilot news',
    short_name: 'Advantive Copilot',
    description: 'Dagelijkse Nederlandstalige Microsoft Copilot-updates van Advantive.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8f8',
    theme_color: '#f28c28',
    lang: 'nl-NL',
  };
}
