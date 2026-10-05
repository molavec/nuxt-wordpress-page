<template>
  <section class="nwp-p-10 nwp-bg-gray-50 nwp-rounded-xl nwp-text-center nwp-max-w-3xl nwp-mx-auto nwp-mt-10 nwp-border nwp-border-gray-200">
    <h1 class="nwp-text-4xl nwp-font-black nwp-font-heading nwp-text-primary nwp-mb-4">
      WordPress Template Ready!
    </h1>
    <p class="nwp-text-content nwp-mb-8 nwp-text-lg">
      Build your landing page with Nuxt and export it as an ultra-lightweight HTML block using our centralized design system.
    </p>
    
    <!-- Alpine.js interactivity example -->
    <div v-pre x-data="{ open: false }" class="nwp-mt-4">
      <button 
        x-on:click="open = !open" 
        class="nwp-font-cta nwp-px-8 nwp-py-3 nwp-bg-primary nwp-text-white nwp-rounded-lg hover:nwp-bg-secondary nwp-transition-colors nwp-font-bold nwp-shadow-sm nwp-text-lg"
      >
        Test Interactivity (Alpine.js)
      </button>
      
      <div x-show="open" style="display: none;" class="nwp-mt-6 nwp-p-6 nwp-bg-white nwp-shadow-md nwp-rounded-lg nwp-border-2 nwp-border-accent">
        <p class="nwp-text-secondary nwp-font-medium nwp-text-lg">
          Alpine.js is working perfectly on the client-side without depending on the Vue runtime! We are also using custom Tailwind colors and fonts.
        </p>
      </div>
    </div>
  </section>
</template>
