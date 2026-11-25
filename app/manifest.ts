import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'PITFLY — Физическая подготовка собак',
    short_name: 'PITFLY',
    lang: 'ru',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0e0e0e',
    theme_color: '#0e0e0e',
    icons: [
      { src: '/icons/pitfly-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pitfly-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/pitfly-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
