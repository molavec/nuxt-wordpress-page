<template>
  <section class="tw-p-10 tw-bg-gray-50 tw-rounded-xl tw-text-center tw-max-w-3xl tw-mx-auto tw-mt-10 tw-border tw-border-gray-200">
    <h1 class="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
      ¡Template Listo para WordPress!
    </h1>
    <p class="tw-text-gray-600 tw-mb-8 tw-text-lg">
      Construye tu landing con Nuxt y expórtala como un bloque HTML súper ligero.
    </p>
    
    <!-- Ejemplo de interactividad con Alpine.js -->
    <div v-pre x-data="{ open: false }" class="tw-mt-4">
      <button 
        x-on:click="open = !open" 
        class="tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors tw-font-medium tw-shadow-sm"
      >
        Probar Interactividad (Alpine.js)
      </button>
      
      <div x-show="open" style="display: none;" class="tw-mt-6 tw-p-6 tw-bg-white tw-shadow-md tw-rounded-lg tw-border tw-border-blue-100">
        <p class="tw-text-blue-800 tw-font-medium">
          ¡Alpine.js está funcionando perfectamente en el cliente sin depender del runtime de Vue!
        </p>
      </div>
    </div>
  </section>
</template>
