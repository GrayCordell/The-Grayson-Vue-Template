<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { container } from 'jenesius-vue-modal'
import { onMounted, ref } from 'vue'
import { NMessageProvider } from 'naive-ui'
/**
 * Description: Component that holds all of the app. The ROOT COMPONENT
 * Notes:
 */
import AppMainFrame from './AppMainFrame.vue'
import { env } from './environment/environment.config'

useHead({
  title: env.APP_TITLE,
  meta: [
    {
      name: 'description',
      content: env.APP_DESCRIPTION,
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '../favicon.ico',
    },
  ],
})
const isReady = ref(true) // replace with some logic to determine if the app is ready
onMounted(async () => {
  isReady.value = true // replace with some logic to determine if the app is ready
})
</script>

<template>
  <template v-if="isReady">
    <NMessageProvider>
      <AppMainFrame />
    </NMessageProvider>
  </template>
  <div v-else>
    <!-- TODO make a loading screen? -->
    loading...
  </div>
  <container />
</template>
