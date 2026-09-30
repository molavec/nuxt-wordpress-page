/** @type {import('tailwindcss').Config} */
export default {
  important: '#wp-landing-wrapper',
  prefix: 'tw-',
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F39200',
        secondary: '#4D68B0',
        accent: '#6BABDC',
        textDark: '#353535',
      },
      fontFamily: {
        heading: ['Roboto', 'sans-serif'],
        body: ['"Red Hat Text"', 'sans-serif'],
        cta: ['Palanquin', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
