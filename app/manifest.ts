import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Love Timeline',
    short_name: 'Timeline',
    description: 'Private relationship tracker with forever counter.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f4ea',
    theme_color: '#6a846b',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
