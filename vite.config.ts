// noinspection JSUnusedGlobalSymbols
import * as path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import Vue from '@vitejs/plugin-vue'
// import Unocss from 'unocss/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'

import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
// import Inspect from 'vite-plugin-inspect'
import webfontDownload from 'vite-plugin-webfont-dl'
import VueDevTools from 'vite-plugin-vue-devtools'

// eslint-disable-next-line node/prefer-global/process
let BASE = process.env.VITE_APPLICATION_ID || '/devApp1/'
if (!BASE.includes('/'))
  BASE = `/${BASE}/`

const ROUTES = path.resolve(__dirname, './src/router/routes.js')
const MAIN = path.resolve(__dirname, './src/main.js')

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE,
  publicDir: 'public',
  define: {/* Globals */},
  esbuild: {
    // drop: mode === 'production' ? ['console', 'debugger'] : [], // drop console logs in production
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`, // path alias
      './runtimeConfig': './runtimeConfig.browser',
      '/routes': ROUTES, // This is used to conditionally load the routes.js file. Probably not needed for most projects.
      '/conditionalMain': MAIN, // This is used to conditionally load the main.js file. Probably not needed for most projects.
    },
  },
  plugins: [
    basicSsl(),

    Vue({
      include: [/\.vue$//* /,\.md$/ */],
      template: {
        compilerOptions: {
          // isCustomElement: tag => ['math-field'].includes(tag) || ['deep-chat'].includes(tag),
        },
      },
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      customCollections: {
      // a helper to load icons from the file system
      // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
      // you can also provide a transform callback to change each icon (optional)
        'my-icons': FileSystemIconLoader('./src/assets/icons', // TODO? change to public?
          (svg: any) => svg.replace(/^<svg /, '<svg fill="currentColor" ')),
      },
    }),
    ViteImageOptimizer({ /* options */}),
    webfontDownload(),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3000/__inspect/ to see the inspector
    // Inspect(), // Removed due to TypeScript errors

    // https://github.com/webfansplz/vite-plugin-vue-devtools
    VueDevTools({
      launchEditor: 'webstorm',
    }),

    // quasar({ sassVariables: './dash-quasar-variables.sass' }),

    // see unocss.config.ts for config
    // Unocss(),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }), // Used for loading yaml conversation files

    /// / https://github.com/antfu/unplugin-auto-import
    // AutoImport({    //  imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],    //  dts: 'src/auto-imports.d.ts',    //  vueTemplate: true,    //})  ],
  ],
  build: {
    target: 'esnext',
  },
  optimizeDeps: {},
  server: { port: 5001 },
  preview: { port: 4000 },
})
