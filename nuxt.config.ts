import templateConfig from './template.config.json'

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
      htmlAttrs: { lang: 'en' },
      title: 'Nuxt WP Landing Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'Optimized starter template for building static Landing Pages with Nuxt, Tailwind CSS, and Alpine.js to inject into WordPress.' },
        { name: 'keywords', content: 'Nuxt, WordPress, Landing Page, Tailwind CSS, Alpine.js, Template' },
        { property: 'og:title', content: 'Nuxt WP Landing Template' },
        { property: 'og:description', content: 'Optimized starter template for building static Landing Pages to inject into WordPress.' },
        { property: 'og:type', content: 'website' }
      ],
      script: [
        { src: templateConfig.alpineCdnUrl, defer: true }
      ],
      bodyAttrs: {
        class: 'tw-font-sans tw-text-gray-900 tw-bg-white'
      }
    }
  }
})
