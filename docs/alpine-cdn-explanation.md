# Keep Alpine.js via CDN in the WordPress build

Since this template is focused on generating lightweight output to inject into WordPress, using Alpine.js via CDN is an excellent strategy to avoid inflating the size of local files.

However, the export script (`scripts/build-wordpress.mjs`) currently performs a very strict cleanup of the resulting Nuxt HTML and **removes all `<script>` tags**, causing the Alpine CDN to be lost in the file uploaded to WordPress.

Below is the solution to keep the CDN in the final WordPress output while ensuring that both the local development environment (Nuxt) and the export script use **the same version of Alpine.js** (Single Source of Truth).

## Step 1: Create a common configuration file

To avoid having the CDN URL repeated in multiple files (one TypeScript and one pure Node.js), we will create a JSON file in the root of the project.

Create a file named `template.config.json` in the root of the project:

```json
{
  "alpineCdnUrl": "https://cdn.jsdelivr.net/npm/alpinejs@3.13.8/dist/cdn.min.js"
}
```

> **Tip:** It is highly recommended to use a specific version (like `@3.13.8`) instead of generic ones (`@3.x.x`) to prevent unexpected changes in Alpine.js from breaking your Landing Page in the future.

## Step 2: Update `nuxt.config.ts`

Nuxt allows importing JSON files natively. We will use this file to inject the CDN during local development.

Modify your `nuxt.config.ts`:

```typescript
import templateConfig from './template.config.json'

export default defineNuxtConfig({
  // ... your current configuration ...
  app: {
    head: {
      script: [
        // We use the URL from the JSON
        { src: templateConfig.alpineCdnUrl, defer: true }
      ],
      // ...
    }
  }
})
```

## Step 3: Modify `scripts/build-wordpress.mjs`

For Alpine to reach the final WordPress file, we are going to safely inject it *after* the script has cleaned up the residual Nuxt garbage. Since the HTML is intended for a WordPress HTML Block, putting the `<script>` at the end is 100% valid.

Open `scripts/build-wordpress.mjs` and modify the `cleanHTML` function:

**Before:**
```javascript
function cleanHTML(html) {
  // ... (cleanup code) ...

  // Wrap in scoped container
  return `<div id="${SCOPE_ID}">\n${html.trim()}\n</div>`;
}
```

**After:**
```javascript
function cleanHTML(html) {
  // ... (cleanup code) ...

  // 1. Read the JSON file to get the CDN
  const configContent = readFileSync(join(ROOT, 'template.config.json'), 'utf-8');
  const templateConfig = JSON.parse(configContent);

  // 2. Build the script tag using the shared URL
  const alpineCdn = `<script defer src="${templateConfig.alpineCdnUrl}"></script>`;

  // 3. Return the final HTML injecting Alpine at the end
  return `<div id="${SCOPE_ID}">\n${html.trim()}\n</div>\n\n<!-- Alpine.js Injection for WordPress -->\n${alpineCdn}`;
}
```

---

### Summary of Benefits
- **Zero interactivity issues in WP:** When copying the content of `wordpress/index.html` to the CMS, Alpine.js travels with it.
- **Maintainability:** If a new version of Alpine comes out, you only update `template.config.json`.
- **Independence:** You do not depend on a WordPress administrator or plugin to install Alpine in the general site header; your HTML block is 100% autonomous.
