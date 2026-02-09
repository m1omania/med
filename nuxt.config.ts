// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: false,
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],
  app: {
    head: {
      title: 'AntiOnko — онкология Петрозаводск',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Онко-платформа AntiOnko: оценка рисков, рекомендации, клиники Петрозаводска и Карелии. Персональный скрининг и поддержка.',
        },
        { name: 'keywords', content: 'онкология Петрозаводск, рак, скрининг, клиники Карелия' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: '',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      hfApiKey: process.env.HF_API_KEY || '',
    },
  },
  ssr: true,
  routeRules: {
    '/api/**': { cors: true },
  },
})
