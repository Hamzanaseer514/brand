import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A & N Premium Perfumes',
    short_name: 'A & N',
    description: 'Premium Arabic Perfumes and Ittar Collection by Rana Nouman',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#d4af37',
    icons: [
      {
        src: '/images/1.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}

