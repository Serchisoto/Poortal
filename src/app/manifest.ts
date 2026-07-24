import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'POORTAL – Concierge Digital',
    short_name: 'POORTAL',
    description:
      'Descubre y reserva las mejores experiencias turísticas. Tours, actividades, restaurantes y más.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#B8960C',
    categories: ['travel', 'lifestyle', 'entertainment'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Pantalla principal – Cancún',
      },
    ],
  }
}
