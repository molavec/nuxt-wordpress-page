# Comparison: Alpine.js via NPM vs. CDN in WordPress

When building a static template with Nuxt to inject into WordPress, the way you integrate Alpine.js has direct impacts on performance, ease of development, and maintenance.

Here is a comprehensive comparison between both strategies:

## 1. Import via CDN (Adapted current strategy)

A `<script src="https://cdn...">` tag is injected directly into the exported final HTML.

### Advantages (Pros)
* **Extreme local lightweight:** The `wordpress/script.js` file remains almost empty (less than 1 KB). You do not add weight to the physical files copied to WordPress.
* **Shared browser cache:** If a user has already visited another website using the exact same version of Alpine.js from `jsdelivr` or `unpkg`, their browser won't download it again, making the load instantaneous.
* **Build simplicity:** Injecting a string with the `<script>` tag in the Node.js build process is trivial and requires no dependency reading or complex bundling tools.

### Disadvantages (Cons)
* **External dependency (Uptime):** If the CDN suffers an outage or is blocked by corporate network policies (firewalls), your Landing Page's interactivity will completely break.
* **Network overhead (Latency):** The user's browser has to perform an additional DNS resolution and open a new HTTP connection to an external domain (`cdn.jsdelivr.net`), adding valuable milliseconds to the initial load.
* **Difficulty using Plugins:** If you need to use Alpine plugins (like `Intersect`, `Collapse`, or `Mask`), you'll have to add and manage multiple different CDN tags, ensuring they load in the correct order.

---

## 2. Import as NPM Package (Bundled)

It is installed via `pnpm add alpinejs`, and the export script reads the compiled file from `node_modules` to concatenate it inside `wordpress/script.js`.

### Advantages (Pros)
* **Total control and isolation:** You do not rely on external servers. The Alpine code is served from the same domain as your WordPress, reducing DNS resolution times and external SSL connections.
* **Strict version locking:** The exact version is recorded in your `pnpm-lock.yaml` and `package.json`, ensuring all developers on the team have the exact same code.
* **Scalability with Plugins:** Installing additional plugins is much more robust. Instead of concatenating multiple CDNs, you can use a lightweight bundler (like `esbuild` or `rollup`) within your script to compile Alpine + your Node plugins into a single optimized file.
* **Offline Development:** You can work and test interactivity locally (`pnpm dev`) without needing an internet connection.

### Disadvantages (Cons)
* **Increased local block size:** The `wordpress/script.js` file will weigh around 40-50 KB (minified). You will have to copy a much longer text into your CMS (although for modern web standards, it is still very light).
* **No third-party caching:** Every new visitor will have to download Alpine from your server. You do not benefit from them already having it cached from other websites.
* **Increased Build complexity:** If you move from simply concatenating strings to wanting to use `import Alpine from 'alpinejs'` alongside custom plugins, the `build-wordpress.mjs` script will require integrating a JS bundler (e.g., `esbuild`), adding an extra step to the pipeline.

---

## Verdict and Recommendation

**When to use CDN?**
If your number one priority is having extremely small physical files for quick copy-pasting, and you don't plan to use complex Alpine.js plugins, the **centralized CDN** strategy (using the `template.config.json` file) is ideal and more than sufficient.

**When to use NPM?**
If the Landing Page is critical to your business, requires high security/uptime levels, needs to load multiple Alpine plugins (animations, masks, persistence), or you prefer serving everything from the same server to maximize performance metrics (like in Google PageSpeed by limiting external domains), migrating to an **NPM-based model** is the recommended professional route.
