import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Camryn + Miles Forever',
    short_name: 'C+M Forever',
    description: 'A cozy private journey clock for Camryn and Miles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff4ec',
    theme_color: '#d67788',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
