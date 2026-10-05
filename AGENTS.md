# Contexto del Proyecto
Estás construyendo una Landing Page en Nuxt que será exportada a un bloque HTML estático e inyectado en WordPress. La ligereza es primordial. Todo el JS de Vue es eliminado durante el proceso de exportación.

# Reglas de Desarrollo

## 1. Interactividad (Alpine.js vs Vue)
* **CERO REACTIVIDAD EN VUE**: Nunca uses `ref`, `reactive`, `methods`, ni sintaxis de eventos de Vue como `@click` o `:class`. 
* **USO DE ALPINE.JS**: Toda la interactividad (modales, menús, acordeones, galerías) debe hacerse usando Alpine.js directamente en el HTML (con atributos como `x-data`, `x-show`).
* **EVITAR CONFLICTOS VUE/ALPINE**: Utiliza SIEMPRE la sintaxis larga de Alpine `x-on:click` y `x-bind:class` para que el compilador de Vue no falle al encontrar directivas que no entiende. Si un bloque contiene mucha lógica de Alpine.js y choca con Vue, envuelve todo el bloque en la directiva `<div v-pre>` para que Vue lo ignore durante el renderizado estático.

## 2. Estilos y Diseño (Tailwind CSS)
* **PREFIJO DE TAILWIND OBLIGATORIO**: Todas las clases de Tailwind DEBEN llevar el prefijo `nwp-` (ej. `nwp-flex`, `nwp-hidden`, `hover:nwp-bg-red-500`, `md:nwp-w-1/2`). Si omites el prefijo, los estilos no aplicarán para evitar colisiones con WordPress.
* **SIN ESTILOS SCOPED**: Nunca utilices `<style scoped>`. Todos los estilos que necesites escribir deben ser aplicados de forma global utilizando la etiqueta `<style>` normal.

## 3. Estructura de Archivos (Vue)
* **ORDEN DE ETIQUETAS**: Al escribir un componente, utiliza estrictamente este orden: `script`, `template` y `style`.
