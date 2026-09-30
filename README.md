# Nuxt WP Landing Template

An optimized starter template for building static **Landing Pages** using Nuxt 3, Tailwind CSS, and Alpine.js, designed to be injected directly into WordPress pages or blocks without causing conflicts.

Lightweight and performance are the primary goals of this project. Therefore, we remove the full Vue reactivity in the final export and delegate light interactivity to Alpine.js.

## 🚀 Features

* **Zero Vue Reactivity in Production**: All Vue JavaScript is stripped out during the export process to save hundreds of kilobytes and ensure ultra-fast loading.
* **Interactivity with Alpine.js**: Modals, menus, accordions, and other interactive elements are handled directly in HTML using Alpine attributes (`x-data`, `x-show`, etc.).
* **Isolated Tailwind CSS**: All utility classes are strictly prefixed with `tw-` (e.g., `tw-flex`, `tw-hidden`). This prevents your styles from clashing with the WordPress theme or installed plugins.
* **Clean Export**: A custom script handles extracting the final HTML and the purged, isolated CSS into a ready-to-copy folder.

## 🛠️ Strict Development Rules

1. **DO NOT use Vue reactive directives** (`ref`, `reactive`, `methods`, `@click`, `:class`). Always use Alpine.js syntax.
2. **Avoid syntax conflicts**: Use Alpine's long syntax (`x-on:click`, `x-bind:class`) to prevent the Vue compiler from attempting to interpret unknown directives.
3. **Complex Alpine blocks**: If a block contains too much Alpine.js logic and clashes with Vue during development, wrap it in a `<div v-pre>` to tell Vue to skip its rendering.
4. **Mandatory prefix**: Don't forget to add `tw-` to every Tailwind class (e.g., `hover:tw-bg-red-500`, `md:tw-w-1/2`). If you omit the prefix, the class will not exist.

## 📦 Installation and Usage

Make sure to use [pnpm](https://pnpm.io/) for dependency management.

```bash
# 1. Install dependencies
pnpm install

# 2. Start the local development server
pnpm dev
```

## 🏗️ Export Workflow to WordPress

Once you've finished your landing page and want to port it to WordPress:

```bash
# 1. Generate the static HTML with Nuxt
pnpm run generate

# 2. Build, purge, and prepare for WordPress
node scripts/build-wordpress.mjs
```

Upon completion, the ready-to-use files will be located inside the `/wordpress` folder. Simply copy the HTML and add it to your WordPress site, ensuring you include the generated stylesheet.

## Alpine.js Documentation

**Current Implementation Note:**
Currently, the project is configured to load Alpine.js via a **centralized CDN**. The CDN URL is globally defined as a Single Source of Truth in the `template.config.json` file. This ensures that both the development environment (Nuxt) and the final exporter (`build-wordpress.mjs`) use the exact same version without bloating the local files. If you wish to explore other installation methods, refer to the following documents.

* [Alpine with pnpm Explanation](docs/alpine-pnpm-explanation.md)
* [Alpine with CDN Explanation](docs/alpine-cdn-explanation.md)
* [Alpine Comparison: npm vs CDN](docs/alpine-npm-vs-cdn-comparison.md)
