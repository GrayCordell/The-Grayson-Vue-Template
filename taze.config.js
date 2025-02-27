// @ts-check
import { defineConfig } from 'taze'

export default defineConfig({

  // ignore packages from bumping
  exclude: [
    '@tinymce/tinymce-vue',
    'tinymce',
  ],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `npm install` or `yarn install` right after bumping
  install: true,
  // ignore paths for looking for package.json in monorepo
  ignorePaths: [
    '**/node_modules/**',
    '**/test/**',
  ],
  // override with different bumping mode for each package
  packageMode: {
    'typescript': 'major',
    'vue': 'major',
    'mathsteps-experimental-fork': 'major',
    'dev-bettysbrain-backend-api': 'major',
    '@knowlearning/agents': 'major',
    'pnpm': 'major',
    '@antfu/eslint-config': 'major',
    'eslint': 'major',
    '@typescript-eslint/eslint-plugin': 'major',
    '@typescript-eslint/parser': 'major',
    '@volar/language-server': 'major',
    '@vue/language-server': 'major',
    '@vitejs/plugin-vue': 'major',
    '@vue/test-utils': 'major',
    'vue-tsc': 'major',
    'vite': 'major',
    'vite-bundle-visualizer': 'major',
    'vite-plugin-image-optimizer': 'major',
    'vite-plugin-inspect': 'major',
    'vite-plugin-vue-inspector': 'major',
    'vite-plugin-webfont-dl': 'major',
    '@vueuse/core': 'major',
    '@vueuse/math': 'major',
    '@vueuse/sound': 'major',
    '@vueuse/components': 'major',
  },
  loglevel: 'info',

  // disable checking for "overrides" package.json field
  // depFields: {
  //   overrides: false,
  // },
})
