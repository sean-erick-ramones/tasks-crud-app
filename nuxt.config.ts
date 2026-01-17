// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/test-utils/module', '@nuxt/eslint', '@nuxtjs/tailwindcss'],

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '#shared/*': ['./shared/*'],
        },
      },
    },
  },

  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },
});
