# Nuxt WordPress Landing Template

**Build WordPress Landing Pages using Nuxt.**

Starter template in Nuxt for building static HTML Landing Pages seamlessly injected into WordPress pages or blocks without style compatibility issues.

Lightweight and performance are the primary goals of this project. To achieve this, we rely on a specific tech stack:

* **Nuxt 3:** Provides a world-class developer experience with component auto-imports and powerful static generation (SSG) to build the HTML scaffolding rapidly.
* **Tailwind CSS:** Allows rapid, utility-first styling. It is configured with a strict `nwp-` prefix to guarantee zero CSS conflicts with your existing WordPress theme and simply branding in `tailwind.config.js`.
* **Alpine.js:** Replaces Vue's heavy reactivity in the final output. It delivers just enough JavaScript for UI interactions directly in the HTML while keeping the bundle size microscopic.
* **AI Agents Context:** The project includes an `AGENTS.md` file at the root. If you use AI assistants, this file provides global rules to maintain consistency and prevent the use of unsupported features.


## How to use

1. **Clone the template:** Use Nuxt's native tool Giget, to scaffold your project seamlessly. Run the following command in your terminal:

```bash
npx nuxi init -t github:molavec/nuxt-wordpress-page my-landing-page
```

* Replace `my-landing-page` with the name of your project.
* Then, navigate into your new folder and install the dependencies (e.g., `pnpm install`).

2. Develop your pages exactly as you normally would in a standard Nuxt project destined for Static Site Generation (SSG).

Simply run 

```bash
pnpm dev
``` 

3. If you are developing this template using AI agents, the included **`AGENTS.md`** file provides the necessary context automatically. It explicitly instructs agents to avoid Vue's reactivity system entirely, enforce Tailwind prefixes, and delegate all logic to Alpine.js, ensuring output remains compliant with the template's rules.

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

We use a **Single Source of Truth** for all branding and external dependencies. All customizations should be done inside the `template.config.json` file located in the root of the project:

```json
{
  "alpineCdnUrl": "...",
  "googleFontsUrl": "...",
  "theme": {
    "colors": {
      "primary": "#F39200",
      "secondary": "#4D68B0",
      "accent": "#6BABDC",
      "content": "#353535"
    },
    "fonts": {
      "heading": ["Roboto", "sans-serif"],
      "body": ["\"Red Hat Text\"", "sans-serif"],
      "cta": ["Palanquin", "sans-serif"]
    }
  }
}
```

The rest of the configuration files are wired to read directly from this JSON:
* **`tailwind.config.js`**: Automatically maps the `theme.colors` and `theme.fonts` properties to your Tailwind utility classes. It is crucial that the `prefix: 'nwp-'` configuration remains intact so that your generated classes never conflict with existing WordPress stylesheets.
* **`nuxt.config.ts`**: Dynamically injects `googleFontsUrl` and `alpineCdnUrl` into the `<head>` of your document during local development.
* **`scripts/build-wordpress.mjs`**: Reads the same properties to inject them into the final static output (`main.css` and `index.html`) during the WordPress export process, ensuring 100% consistency.

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
