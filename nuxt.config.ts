import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  // Rahasia hanya dibaca di server. Isi lewat file .env (lihat .env.example)
  runtimeConfig: {
    databaseUrl: '',
    adminPassword: '',
    sessionSecret: '',
    public: {
      // Alamat website, mis. https://rental-miftah.vercel.app (dipakai sitemap & canonical)
      siteUrl: process.env.SITE_URL || ''
    }
  },

  // Halaman admin dirender di browser saja (SPA), tidak diindeks mesin pencari
  routeRules: {
    '/admin': { redirect: '/admin/konsol' },
    '/admin/**': { ssr: false }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#050505' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' }
      ]
    }
  }
})
