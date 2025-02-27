/**
 * Description: Main entry point for the application.
 * Notes: Initialises the Vue app, and loads the main App component.
 * Checkout vite.config.js for the current setup. (vite is the bundler used, may add special behaviors, specified in vite.config.js)
 */
import App from './app/App.vue'
import { createApp } from 'vue'
import { piniaStores } from './store'
import router from './router/index.js'

// Global styles
import '~/app/setup/styles/index.pcss'

// Simple alerts/toasts/context menus
import VueSimpleAlert from 'vue3-simple-alert'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

// UNOCSS
import 'uno.css'
import 'virtual:unocss-devtools'

// i18n
import { i18n, i18nSetup } from '~/app/setup/i18n'

/// DomPurifyComponent (safer alternative to v-html)
import VueDOMPurifyHTML from 'vue-dompurify-html'

// Theming
import { initTheme } from '~/app/setup/styles/theme'
//
import { createHead } from '@unhead/vue'

import { createPinia } from 'pinia'
import { actionTrackerPiniaPlugin } from '~/store/watch/actionTrackerPluginPinia'


// Create the app
const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(router)
  .use(pinia)
  .use(head)
  .use(VueSimpleAlert)
  .use(i18n)
  .use(VueDOMPurifyHTML, {
    namedConfigurations: {
      embeddedIFrames: {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allowfullscreen', 'scrolling'],
      },
    },
    hooks: {
      uponSanitizeElement: (node, data) => {
        // console.log('node', node)
        if (data.tagName === 'iframe') {
          const src = node.getAttribute('src') || ''
          if (!src.startsWith('https://www.youtube.com/embed/'))
            return node.parentNode.removeChild(node)
        }
      },
    },
  })

i18nSetup().then(r => console.log('i18nSetup complete', r))
initTheme()
actionTrackerPiniaPlugin(piniaStores)
app.mount('#app') // Mount the app to the #app div in index.html

