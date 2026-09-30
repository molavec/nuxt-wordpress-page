<template>
  <section class="tw-p-10 tw-bg-gray-50 tw-rounded-xl tw-text-center tw-max-w-3xl tw-mx-auto tw-mt-10 tw-border tw-border-gray-200">
    <h1 class="tw-text-4xl tw-font-black tw-font-heading tw-text-primary tw-mb-4">
      WordPress Template Ready!
    </h1>
    <p class="tw-text-textDark tw-mb-8 tw-text-lg">
      Build your landing page with Nuxt and export it as an ultra-lightweight HTML block using our centralized design system.
    </p>
    
    <!-- Alpine.js interactivity example -->
    <div v-pre x-data="{ open: false }" class="tw-mt-4">
      <button 
        x-on:click="open = !open" 
        class="tw-font-cta tw-px-8 tw-py-3 tw-bg-primary tw-text-white tw-rounded-lg hover:tw-bg-secondary tw-transition-colors tw-font-bold tw-shadow-sm tw-text-lg"
      >
        Test Interactivity (Alpine.js)
      </button>
      
      <div x-show="open" style="display: none;" class="tw-mt-6 tw-p-6 tw-bg-white tw-shadow-md tw-rounded-lg tw-border-2 tw-border-accent">
        <p class="tw-text-secondary tw-font-medium tw-text-lg">
          Alpine.js is working perfectly on the client-side without depending on the Vue runtime! We are also using custom Tailwind colors and fonts.
        </p>
      </div>
    </div>
  </section>
</template>
