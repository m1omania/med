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
      title: 'AntiOnko — онко-скрининг и рекомендации',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Онко-платформа AntiOnko: оценка рисков, рекомендации и подбор клиник. Персональный скрининг и поддержка.',
        },
        { name: 'keywords', content: 'онкология, рак, скрининг, клиники, диагностика' },
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
    '/news': { redirect: '/methods' },
    '/news/**': { redirect: '/methods/**' },
  },
})
