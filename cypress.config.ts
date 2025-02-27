import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  projectId: 'dnvrjk',

  e2e: {
    baseUrl: 'https://localhost:5001',
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.spec.*',
    supportFile: false,
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
