import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finance CFO - Gestão Financeira Pessoal',
    short_name: 'Finance CFO',
    description: 'Gestão Financeira Pessoal com Governança Corporativa, DRE em cascata e Liquidez',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F19',
    theme_color: '#0B0F19',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
