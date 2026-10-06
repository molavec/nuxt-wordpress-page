#!/usr/bin/env node

/**
 * Post-build script: Extracts Nuxt static output into WordPress-compatible
 * HTML, CSS, and JS files for use in a Custom HTML Block.
 *
 * Usage: node scripts/build-wordpress.mjs
 * Run after: pnpm run generate
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = join(ROOT, '.output', 'public');
const NUXT_DIR = join(OUTPUT_DIR, '_nuxt');
const ROUTE = process.argv[2] || 'index';
const WP_DIR = ROUTE === 'index' ? join(ROOT, 'wordpress') : join(ROOT, 'wordpress', ROUTE);
const SCOPE_ID = 'wp-landing-wrapper';
const SCOPE = `#${SCOPE_ID}`;

// ===================================================================
// 1. HTML Extraction & Cleanup
// ===================================================================

function extractHTML() {
  const htmlPath = ROUTE === 'index' ? join(OUTPUT_DIR, 'index.html') : join(OUTPUT_DIR, ROUTE, 'index.html');
  const html = readFileSync(htmlPath, 'utf-8');

  // Extract <main>...</main> content (rendered by index.vue)
  const mainMatch = html.match(/<main>([\s\S]*)<\/main>/);
  if (mainMatch) {
    return `<main>${mainMatch[1]}</main>`;
  }

  // Fallback: extract everything inside <div id="__nuxt">
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) throw new Error('Could not extract content from index.html');

  let content = bodyMatch[1].trim();
  // Remove the __nuxt wrapper div (first and last div tags)
  content = content.replace(/^<div id="__nuxt">\s*<div>/, '');
  content = content.replace(/<\/div>\s*<\/div>\s*$/, '');
  return content;
}

function cleanHTML(html) {
  // Remove Vue hydration comments
  html = html.replace(/<!--\[-->/g, '');
  html = html.replace(/<!--\]-->/g, '');
  html = html.replace(/<!---->/g, '');

  // Remove data-v-* scoped attributes
  html = html.replace(/\s+data-v-[a-f0-9]+="[^"]*"/g, '');
  html = html.replace(/\s+data-v-[a-f0-9]+/g, '');

  // Remove any remaining <script> tags (Nuxt hydration scripts)
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Clean up excessive whitespace (multiple blank lines → single)
  html = html.replace(/\n{3,}/g, '\n\n');

  

  // Wrap in scoped container
  const configContent = readFileSync(join(ROOT, 'template.config.json'), 'utf-8');
  const templateConfig = JSON.parse(configContent);
  const alpineCdn = `<script defer src="${templateConfig.alpineCdnUrl}"></script>`;

  return `<div id="${SCOPE_ID}">\n${html.trim()}\n</div>\n\n<!-- Inyección de Alpine.js para WordPress -->\n${alpineCdn}`;
}

// ===================================================================
// 2. CSS Collection & Scoping
// ===================================================================

function collectCSS() {
  let css = '';

  // 1. Read external CSS files (skip error pages)
  const files = readdirSync(NUXT_DIR).filter(
    (f) => f.endsWith('.css') && !f.includes('error-')
  );
  for (const file of files) {
    css += readFileSync(join(NUXT_DIR, file), 'utf-8') + '\n';
  }

  // 2. Extract inline <style> blocks from index.html <head>
  const html = readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf-8');
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const styleMatches = headMatch[1].matchAll(/<style>([\s\S]*?)<\/style>/gi);
    for (const m of styleMatches) {
      css += m[1] + '\n';
    }
  }

  return css;
}

/**
 * Find the position of the closing brace that matches the opening brace
 * at `openPos`.
 */
function findMatchingBrace(css, openPos) {
  let depth = 1;
  let i = openPos + 1;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') depth--;
    i++;
  }
  return i - 1;
}

/**
 * Prefix each individual selector in a comma-separated selector list
 * with the scoping selector.
 */
function prefixSelectors(selectorStr, scope) {
  return selectorStr
    .split(',')
    .map((sel) => {
      sel = sel.trim();
      if (!sel) return sel;

      // :root, html, body → apply to the container itself
      if (sel === ':root' || sel === 'html' || sel === 'body') {
        return scope;
      }

      // Universal selector alone
      if (sel === '*') return `${scope} *`;

      // Pseudo-elements/classes alone (::backdrop, :after, :before)
      if (/^::?\w/.test(sel) && !/[.#\[\s]/.test(sel)) {
        return `${scope} ${sel}`;
      }

      // Everything else: prefix with scope
      return `${scope} ${sel}`;
    })
    .join(',');
}

/**
 * Prefix CSS class selectors with 'nwp-' to avoid conflicts.
 */
function prefixSelectorClasses(selector) {
  // Split by [ ... ] to avoid replacing inside attribute selectors
  const parts = selector.split(/(\[[^\]]+\])/);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) { // Only process outside brackets
      const regex = /\.((?:\\[\s\S]|[a-zA-Z_-][a-zA-Z0-9_-]*)+)/g;
      parts[i] = parts[i].replace(regex, (match, className) => '.nwp-' + className);
    }
  }
  return parts.join('');
}

/**
 * Recursively scope all CSS selectors under the given scope selector.
 * Handles @keyframes (verbatim), @media (recurse), @font-face (verbatim),
 * @import/@charset (verbatim), and regular rules.
 */
function scopeCSS(css, scope) {
  // Remove data-v-* attribute selectors (replaced by #wsol-2026 scoping)
  css = css.replace(/\[data-v-[a-f0-9]+\]/g, '');

  let result = '';
  let pos = 0;

  while (pos < css.length) {
    // Skip whitespace
    if (/\s/.test(css[pos])) {
      result += css[pos++];
      continue;
    }

    // ---- @keyframes: copy verbatim ----
    if (
      css.startsWith('@keyframes', pos) ||
      css.startsWith('@-webkit-keyframes', pos)
    ) {
      const bracePos = css.indexOf('{', pos);
      if (bracePos === -1) break;
      const blockEnd = findMatchingBrace(css, bracePos);
      result += css.slice(pos, blockEnd + 1);
      pos = blockEnd + 1;
      continue;
    }

    // ---- Other @ rules ----
    if (css[pos] === '@') {
      const bracePos = css.indexOf('{', pos);
      const semiPos = css.indexOf(';', pos);

      const atRulePreview = css.slice(pos, pos + 20);

      // @import, @charset → copy to semicolon
      if (
        atRulePreview.startsWith('@import') ||
        atRulePreview.startsWith('@charset')
      ) {
        if (semiPos !== -1) {
          result += css.slice(pos, semiPos + 1);
          pos = semiPos + 1;
        } else {
          result += css.slice(pos);
          break;
        }
        continue;
      }

      if (bracePos === -1) break;

      // @font-face → copy verbatim
      if (atRulePreview.startsWith('@font-face')) {
        const blockEnd = findMatchingBrace(css, bracePos);
        result += css.slice(pos, blockEnd + 1);
        pos = blockEnd + 1;
        continue;
      }

      // @media, @supports, @layer, etc. → recurse into inner content
      const atRule = css.slice(pos, bracePos).trim();
      const blockEnd = findMatchingBrace(css, bracePos);
      const innerCSS = css.slice(bracePos + 1, blockEnd);
      const scopedInner = scopeCSS(innerCSS, scope);
      result += atRule + '{' + scopedInner + '}';
      pos = blockEnd + 1;
      continue;
    }

    // ---- Regular rule: selector { declarations } ----
    const bracePos = css.indexOf('{', pos);
    if (bracePos === -1) {
      // No more rules, append remainder and exit
      result += css.slice(pos);
      break;
    }

    const selector = css.slice(pos, bracePos).trim();
    const blockEnd = findMatchingBrace(css, bracePos);
    const declarations = css.slice(bracePos + 1, blockEnd);

    const prefixedClasses = prefixSelectorClasses(selector);
    const scopedSelector = prefixSelectors(prefixedClasses, scope);
    result += scopedSelector + '{' + declarations + '}';
    pos = blockEnd + 1;
  }

  return result;
}

function buildCSS(rawCSS) {
  const configContent = readFileSync(join(ROOT, 'template.config.json'), 'utf-8');
  const templateConfig = JSON.parse(configContent);
  const fontsImport = `@import url('${templateConfig.googleFontsUrl}');\n\n`;

  const scopedCSS = rawCSS; // Tailwind handles scoping via important

  return fontsImport + scopedCSS;
}

// ===================================================================
// Main
// ===================================================================

function main() {
  const targetName = ROUTE === 'index' ? 'wordpress' : `wordpress/${ROUTE}`;
  console.log(`📦 Building WordPress export for '${ROUTE}'…\n`);

  mkdirSync(WP_DIR, { recursive: true });

  // 1. HTML
  console.log('  📄 Extracting HTML…');
  const rawHTML = extractHTML();
  const cleanedHTML = cleanHTML(rawHTML);
  const minifiedHTML = cleanedHTML.replace(/>\s+</g, '><').replace(/<!--[\s\S]*?-->/g, '').trim();
  writeFileSync(join(WP_DIR, 'index.html'), cleanedHTML, 'utf-8');
  writeFileSync(join(WP_DIR, 'index.min.html'), minifiedHTML, 'utf-8');
  console.log(`     ✅ ${targetName}/index.html`);
  console.log(`     ✅ ${targetName}/index.min.html`);

  // 2. CSS
  console.log('  🎨 Processing & scoping CSS…');
  const rawCSS = collectCSS();
  const finalCSS = buildCSS(rawCSS);
  const minifiedCSS = finalCSS.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>~])\s*/g, '$1').trim();
  writeFileSync(join(WP_DIR, 'main.css'), finalCSS, 'utf-8');
  writeFileSync(join(WP_DIR, 'main.min.css'), minifiedCSS, 'utf-8');
  console.log(`     ✅ ${targetName}/main.css`);
  console.log(`     ✅ ${targetName}/main.min.css`);

  // 3. JS
  console.log('  ⚡ Generating JS wrapper…');
  const js = `document.addEventListener('DOMContentLoaded', function () {
  // Alpine.js handles the interactivity natively
});
`;
  const minifiedJS = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();
  writeFileSync(join(WP_DIR, 'script.js'), js, 'utf-8');
  writeFileSync(join(WP_DIR, 'script.min.js'), minifiedJS, 'utf-8');
  console.log(`     ✅ ${targetName}/script.js`);
  console.log(`     ✅ ${targetName}/script.min.js`);

  // Summary
  const htmlBytes = Buffer.byteLength(minifiedHTML);
  const cssBytes = Buffer.byteLength(minifiedCSS);
  const jsBytes = Buffer.byteLength(minifiedJS);
  const totalBytes = htmlBytes + cssBytes + jsBytes;
  const vueJSBytes = 512381; // sum of all .js files in _nuxt

  console.log('\n📊 Output summary (minified):');
  console.log(`   HTML:  ${(htmlBytes / 1024).toFixed(1)} KB`);
  console.log(`   CSS:   ${(cssBytes / 1024).toFixed(1)} KB`);
  console.log(`   JS:    ${(jsBytes / 1024).toFixed(1)} KB`);
  console.log(`   Total: ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log(
    `\n   JS reduction: ${(jsBytes / 1024).toFixed(1)} KB vs ${(vueJSBytes / 1024).toFixed(0)} KB Vue/Nuxt (${((1 - jsBytes / vueJSBytes) * 100).toFixed(0)}% smaller)`
  );
  console.log(`\n✨ Files ready in ${targetName}/ directory`);
}

main();

