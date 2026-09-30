import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templateConfig = JSON.parse(readFileSync(join(__dirname, 'template.config.json'), 'utf-8'));

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
      colors: templateConfig.theme.colors,
      fontFamily: templateConfig.theme.fonts
    }
  },
  plugins: [],
}
