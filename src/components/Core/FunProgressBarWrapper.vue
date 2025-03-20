<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import FunProgressBar from './FunProgressBar.vue'


export interface Props {
  autoHide?: boolean
  hideDelay?: number
  /* Position in viewport */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  label?: string
}
const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  hideDelay: 3000,
  position: 'top-right',
  label: 'Progress',
})

const emit = defineEmits<{
  (event: 'complete'): void
}>()
// Progress state
const progress = ref(0)
const isVisible = ref(true)
const isMinimized = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// Computed styles based on position prop
const positionStyles = computed(() => {
  switch (props.position) {
    case 'top-right': return { top: '20px', right: '20px' }
    case 'top-left': return { top: '20px', left: '20px' }
    case 'bottom-right': return { bottom: '20px', right: '20px' }
    case 'bottom-left': return { bottom: '20px', left: '20px' }
    default: return { top: '20px', right: '20px' }
  }
})

// Progress methods
const setProgress = (value: number) => {
  // Clear any existing hide timeout when progress changes
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }

  progress.value = Math.min(100, Math.max(0, value))
  isVisible.value = true

  // Auto-hide when completed
  if (progress.value >= 100 && props.autoHide) {
    hideTimeout = setTimeout(() => {
      isVisible.value = false
    }, props.hideDelay)
  }
}

const reset = () => {
  progress.value = 0
  isVisible.value = true
}

const minimize = () => isMinimized.value = true
const maximize = () => isMinimized.value = false
const toggle = () => isMinimized.value = !isMinimized.value
const hide = () => isVisible.value = false
const show = () => {
  isVisible.value = true
  isMinimized.value = false
}
const handleComplete = () => emit('complete')

// Clean up timeouts
onUnmounted(() => {
  if (hideTimeout)
    clearTimeout(hideTimeout)
})

// Expose to parent
defineExpose({
  setProgress,
  reset,
  hide,
  show,
  minimize,
  maximize,
  toggle,
})
</script>

<template>
  <Transition name="fade-slide">
    <div
      v-if="isVisible"
      class="top-right-progress"
      :class="{ 'is-minimized': isMinimized }"
      :style="positionStyles"
    >
      <div class="progress-content">
        <FunProgressBar
          v-if="!isMinimized"
          :progress="progress"
          :label="label"
          @complete="handleComplete"
        />
        <div v-else class="minimized-display">
          <span class="min-label">{{ label }}: {{ Math.round(progress) }}%</span>
        </div>
      </div>
      <button class="toggle-button" @click="toggle">
        <span class="toggle-icon">{{ isMinimized ? '⬆️' : '⬇️' }}</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="postcss">
.top-right-progress {
  position: fixed;
  z-index: 1000;
  background-color: var(--primary);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.top-right-progress:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.top-right-progress.is-minimized {
  padding: 8px 12px;
  transform: scale(0.9);
  opacity: 0.8;
  border: 2px solid var(--accent);
  background-color: var(--primary);
}

.top-right-progress.is-minimized:hover {
  opacity: 1;
  transform: scale(0.95);
}

.progress-content {
  flex: 1;
  transition: all 0.3s ease;
}

.minimized-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.min-label {
  font-size: 12px;
  font-weight: bold;
  color: var(--accent);
  white-space: nowrap;
}

.toggle-button {
  margin-left: 8px;
  height: 24px;
  width: 24px;
  /* border-radius: 50%; */
  /* background-color: var(--accent); */
  /* color: var(--primary); */
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0.7;
}

.toggle-button:hover {
  transform: scale(1.1);
  opacity: 1;
  background-color: var(--accent-hover, var(--accent));
}

.toggle-icon {
  font-size: 12px;
  line-height: 1;
}

/* Transition animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
