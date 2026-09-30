# Nuxt WordPress Landing Template

**Build WordPress Landing Pages using Nuxt.**

Starter template in Nuxt for building static HTML Landing Pages seamlessly injected into WordPress pages or blocks without style compatibility issues.

Lightweight and performance are the primary goals of this project. To achieve this, we rely on a specific tech stack:

* **Nuxt 3:** Provides a world-class developer experience with component auto-imports and powerful static generation (SSG) to build the HTML scaffolding rapidly.
* **Tailwind CSS:** Allows rapid, utility-first styling. It is configured with a strict `tw-` prefix to guarantee zero CSS conflicts with your existing WordPress theme and simply branding in `tailwind.config.js`.
* **Alpine.js:** Replaces Vue's heavy reactivity in the final output. It delivers just enough JavaScript for UI interactions directly in the HTML while keeping the bundle size microscopic.
* **'landing' skill:** (Optional) If you use AI assistants, make sure to provide them with the rules from the `.agents/skills/wp-landing` folder to maintain consistency.


## 🛠️ Strict Development Rules

1. **DO NOT use Vue reactive directives** (`ref`, `reactive`, `methods`, `@click`, `:class`). Always use Alpine.js syntax.
2. **Avoid syntax conflicts**: Use Alpine's long syntax (`x-on:click`, `x-bind:class`) to prevent the Vue compiler from attempting to interpret unknown directives.
3. **Complex Alpine blocks**: If a block contains too much Alpine.js logic and clashes with Vue during development, wrap it in a `<div v-pre>` to tell Vue to skip its rendering.
4. **Mandatory prefix**: Don't forget to add `tw-` to every Tailwind class (e.g., `hover:tw-bg-red-500`, `md:tw-w-1/2`). If you omit the prefix, the class will not exist.
5. 

## Why is this useful?

Building landing pages directly inside a CMS can be slow and limited by the theme's existing styles and scripts. This template allows you to enjoy a modern, lightning-fast developer experience (Nuxt 3 + Tailwind) and then export an ultra-lightweight, conflict-free static block that drops perfectly into any WordPress site.

## How to use

Develop your pages exactly as you normally would in a standard Nuxt project destined for Static Site Generation (SSG).

Simply run 

```bash
pnpm dev
``` 

**Important note:**
If you are developing this template using AI agents, you can leverage the included **'landing' skill**. This skill explicitly instructs the agent to avoid Vue's reactivity system entirely and delegate all logic and interactive scripts to Alpine.js, ensuring your output remains compliant with the template's rules.

## Deploy

To inject your finished landing page into WordPress, follow these two steps:

### 1. Generate and Extract

Run 

``` bash
pnpm run generate
```

This tells Nuxt to build the static output of your application and run `node scripts/build-wordpress.mjs`. 

This custom script extracts the essential HTML and isolated CSS into a `/wordpress` folder, stripping away all the heavy Vue JavaScript to guarantee a lightweight footprint.

### 2. Inject into WordPress

### In WordPress Gutenberg Editor 

1. Upload the provided [`only-content.php`](./docs/only-content.php) file to the root of your active WordPress theme and .
1. select **Only Content** Template in Page Options.
1. Copy the HTML, CSS and Script from the `/wordpress` folder into your WordPress site using **HTML Custom block**


### In Elementor editor 
1. Go to the page settings and change the Page Layout to [**Elementor Canvas**](https://elementor.com/help/page-settings/).
1. Copy the HTML, CSS and Script from the `/wordpress` folder into your WordPress site using **HTML Custom Widget**

## Customize

* **`tailwind.config.js`**: Here you define your project's design system (colors, fonts, spacing). It is crucial that the `prefix: 'tw-'` configuration remains intact so that your generated utility classes never conflict with existing WordPress stylesheets.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  important: '#wp-landing-wrapper',
  prefix: 'tw-',
  ...
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
  ...
}
```

* **`nuxt.config.ts`**: Handles the core framework configuration. This is where the Tailwind module is registered and where the Alpine.js CDN is globally injected into the `<head>` of your document (reading dynamically from `template.config.json`).

```typescript
export default defineNuxtConfig({
  ...
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
      bodyAttrs: {
        class: 'tw-font-sans tw-text-gray-900 tw-bg-white'
      }
    }
  }
})
```

## Alpinejs 

### Why

While Nuxt and Vue provide an amazing developer experience for building components, their client-side hydration and virtual DOM add a significant JavaScript payload (often hundreds of kilobytes). For static Landing Pages injected into WordPress, this weight is unnecessary. We strip out Vue entirely during the build process and use **Alpine.js** instead. Alpine gives you the same declarative, component-based reactivity directly in your HTML at a fraction of the cost, keeping your final WordPress block ultra-lightweight and lightning-fast.

Currently, the project is configured to load Alpine.js via a **centralized CDN**. 

* [Alpine Comparison: npm vs CDN](docs/alpine-npm-vs-cdn-comparison.md)


### CDN 

The CDN URL is globally defined as a Single Source of Truth in the `template.config.json` file. This ensures that both the development environment (Nuxt) and the final exporter (`build-wordpress.mjs`) use the exact same version without bloating the local files. 
If you wish to explore other installation methods, refer to the following documents.
* [Alpine with CDN Explanation](docs/alpine-cdn-explanation.md)

### NPM package 
Not implemented in this project, but you can follow this instructions to implement  it
* [Alpine with pnpm Explanation](docs/alpine-pnpm-explanation.md)
