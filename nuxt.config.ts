// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Nuxt WP Landing Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'Plantilla base optimizada para construir Landing Pages estáticas con Nuxt, Tailwind CSS y Alpine.js e inyectarlas en WordPress.' },
        { name: 'keywords', content: 'Nuxt, WordPress, Landing Page, Tailwind CSS, Alpine.js, Template' },
        { property: 'og:title', content: 'Nuxt WP Landing Template' },
        { property: 'og:description', content: 'Plantilla base optimizada para construir Landing Pages estáticas e inyectarlas en WordPress.' },
        { property: 'og:type', content: 'website' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js', defer: true }
      ],
      bodyAttrs: {
        class: 'tw-font-sans tw-text-gray-900 tw-bg-white'
      }
    }
  }
})
