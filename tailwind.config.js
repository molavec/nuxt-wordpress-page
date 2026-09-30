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
    extend: {}
  },
  plugins: [],
}
