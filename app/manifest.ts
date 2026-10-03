import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Microsoft Copilot by Chris Munten',
    short_name: 'Daily Copilot',
    description: 'Dagelijkse Nederlandstalige Microsoft Copilot-updates van Advantive.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8f8',
    theme_color: '#f28c28',
    lang: 'nl-NL',
  };
}
