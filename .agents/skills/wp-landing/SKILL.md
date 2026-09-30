---
name: wp-landing
description: Reglas para construir Landing Pages estáticas e inyectables para WordPress usando Nuxt, Tailwind y Alpine.js.
---
# Contexto
Estás construyendo una Landing Page en Nuxt que será exportada a un bloque HTML estático e inyectado en WordPress. La ligereza es primordial.

# Reglas Estrictas de Desarrollo
1. **NO USAR REACTIVIDAD DE VUE**: Nunca uses `ref`, `reactive`, `methods`, ni sintaxis de eventos de Vue como `@click` o `:class`. Todo el JS de Vue es eliminado durante el proceso de exportación para ahorrar cientos de kilobytes.
2. **INTERACTIVIDAD CON ALPINE.JS**: Toda la interactividad (modales, menús, acordeones, galerías) debe hacerse usando Alpine.js directamente en el HTML (con atributos como `x-data`, `x-show`).
3. **EVITAR CONFLICTOS VUE/ALPINE**: Utiliza SIEMPRE la sintaxis larga de Alpine `x-on:click` y `x-bind:class` para que el compilador de Vue no falle al encontrar directivas que no entiende. Si un bloque contiene mucha lógica de Alpine.js y choca con Vue, envuelve todo el bloque en la directiva `<div v-pre>` para decirle a Vue que lo ignore durante el renderizado estático.
4. **PREFIJO DE TAILWIND**: Todas las clases de Tailwind DEBEN llevar obligatoriamente el prefijo `tw-` (ej. `tw-flex`, `tw-hidden`, `hover:tw-bg-red-500`, `md:tw-w-1/2`). Si omites el prefijo, los estilos no aplicarán porque Tailwind está configurado en estricto modo prefijo para evitar colisiones con WordPress.

# Flujo de Exportación
Para probar tu código localmente, usa `pnpm dev`.
Una vez que el código esté listo, para exportarlo a WordPress ejecuta:
1. `pnpm run generate` (para generar el HTML estático)
2. `node scripts/build-wordpress.mjs` (extraerá el HTML, el CSS purgado y aislado, y dejará todo en la carpeta `/wordpress` listo para copiar)


# Vue
* utilizar en este orden: script, template y style. 