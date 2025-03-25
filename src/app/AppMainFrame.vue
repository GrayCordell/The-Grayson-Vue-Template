<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'


/**
 * Description: Contains the main frame for the app, and the two main components (TheNavBar and ContentFrame)
 * Notes:
 */
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
// watchEffect(() => {
//   console.log('currentRoute', currentRoute.value)
// })
</script>

<template>
  <div class="mainFrame">
    <div v-if="currentRoute.name" class="contentFrame">
      <router-view />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
$black: var(--secondary);

.contentFrame {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.mainFrame {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}
</style>
