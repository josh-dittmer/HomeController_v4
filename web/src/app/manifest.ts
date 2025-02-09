import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'HomeController',
        short_name: 'HC',
        description: 'Control your homebrew IoT devices!',
        start_url: '/login',
        display: 'standalone',
        background_color: '#424141',
        theme_color: '#16a34a',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}