import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finance CFO - Gestão Financeira Pessoal',
    short_name: 'Finance CFO',
    description: 'Gestão Financeira Pessoal com Governança Corporativa, DRE em cascata e Liquidez',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0B0F19',
    theme_color: '#0B0F19',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
