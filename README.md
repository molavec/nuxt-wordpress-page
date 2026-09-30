# Nuxt WP Landing Template

Una plantilla base optimizada para construir **Landing Pages** estáticas utilizando Nuxt 3, Tailwind CSS y Alpine.js, diseñadas para ser inyectadas directamente en páginas o bloques de WordPress sin generar conflictos.

La ligereza y el rendimiento son los objetivos principales de este proyecto. Por ello, prescindimos de la reactividad completa de Vue en la exportación final y delegamos la interactividad ligera a Alpine.js.

## 🚀 Características

* **Cero Reactividad de Vue en Producción**: Todo el JavaScript de Vue es eliminado durante el proceso de exportación para ahorrar cientos de kilobytes y asegurar una carga ultra rápida.
* **Interactividad con Alpine.js**: Modales, menús, acordeones y otros elementos interactivos se manejan directamente en el HTML usando atributos de Alpine (`x-data`, `x-show`, etc.).
* **Tailwind CSS Aislado**: Todas las clases utilitarias llevan el prefijo `tw-` (ej. `tw-flex`, `tw-hidden`) obligatoriamente. Esto evita que tus estilos colisionen con el tema o los plugins instalados en WordPress.
* **Exportación Limpia**: Un script a medida se encarga de extraer el HTML final y el CSS purgado y aislado a una carpeta lista para copiar.

## 🛠️ Reglas Estrictas de Desarrollo

1. **NO uses directivas reactivas de Vue** (`ref`, `reactive`, `methods`, `@click`, `:class`). Usa siempre la sintaxis de Alpine.js.
2. **Evita conflictos de sintaxis**: Utiliza la sintaxis larga de Alpine (`x-on:click`, `x-bind:class`) para evitar que el compilador de Vue intente interpretar directivas que no conoce.
3. **Bloques complejos de Alpine**: Si un bloque contiene demasiada lógica de Alpine.js y choca con Vue durante el desarrollo, envuélvelo en un `<div v-pre>` para decirle a Vue que lo ignore en el renderizado.
4. **Prefijo obligatorio**: No olvides añadir `tw-` a cada clase de Tailwind (ej. `hover:tw-bg-red-500`, `md:tw-w-1/2`). Si omites el prefijo, la clase no existirá.

## 📦 Instalación y Uso

Asegúrate de usar [pnpm](https://pnpm.io/) para la gestión de dependencias.

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo local
pnpm dev
```

## 🏗️ Flujo de Exportación a WordPress

Una vez que hayas terminado tu landing page y quieras llevarla a WordPress:

```bash
# 1. Generar el HTML estático de Nuxt
pnpm run generate

# 2. Compilar, purgar y preparar para WordPress
node scripts/build-wordpress.mjs
```

Al terminar, los archivos listos para usar se encontrarán dentro de la carpeta `/wordpress`. Simplemente copia el HTML y añádelo a tu sitio WordPress, asegurándote de incluir la hoja de estilos generada.

