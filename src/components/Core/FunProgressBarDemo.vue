<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import FunProgressBar from './FunProgressBar.vue'

// Demo states for progress bars
const basicProgress = ref(0)
const mathProgress = ref(0)
const successProgress = ref(0)

// Function to increment progress
const incrementProgress = (target: 'basic' | 'math' | 'success', amount: number) => {
  switch (target) {
    case 'basic':
      basicProgress.value = Math.min(100, basicProgress.value + amount)
      break
    case 'math':
      mathProgress.value = Math.min(100, mathProgress.value + amount)
      break
    case 'success':
      successProgress.value = Math.min(100, successProgress.value + amount)
      break
  }
}

// Reset all progress bars
const resetAll = () => {
  basicProgress.value = 0
  mathProgress.value = 0
  successProgress.value = 0
}

// Auto increment for demo purposes
onMounted(() => {
  // Simulate progress for demo
  const interval = setInterval(() => {
    incrementProgress('basic', 5)

    if (basicProgress.value >= 30) {
      incrementProgress('math', 8)
    }

    if (mathProgress.value >= 50) {
      incrementProgress('success', 10)
    }

    // Reset all when complete
    if (successProgress.value >= 100) {
      setTimeout(() => {
        resetAll()
      }, 3000)
    }
  }, 800)

  // Clear interval when component is unmounted
  onUnmounted(() => {
    clearInterval(interval)
  })
})

// Handle completion events
const handleComplete = (name: string) => {
  console.log(`Progress complete: ${name}`)
}
</script>

<template>
  <div class="demo-container">
    <h2>Fun Progress Bar Demo</h2>

    <div class="progress-examples">
      <div class="progress-example">
        <FunProgressBar
          :progress="basicProgress"
          label="Loading..."
          @complete="handleComplete('basic')"
        />
        <button @click="incrementProgress('basic', 10)">
          +10%
        </button>
      </div>

      <div class="progress-example">
        <FunProgressBar
          :progress="mathProgress"
          label="Math Progress"
          @complete="handleComplete('math')"
        />
        <button @click="incrementProgress('math', 10)">
          +10%
        </button>
      </div>

      <div class="progress-example">
        <FunProgressBar
          :progress="successProgress"
          label="Task Progress"
          @complete="handleComplete('success')"
        />
        <button @click="incrementProgress('success', 10)">
          +10%
        </button>
      </div>
    </div>

    <button class="reset-button" @click="resetAll">
      Reset All
    </button>
  </div>
</template>

<style scoped lang="postcss">
.demo-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  color: var(--secondary);
}

.progress-examples {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.progress-example {
  display: flex;
  align-items: center;
  gap: 20px;
}

button {
  padding: 6px 12px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--accent-hover);
}

.reset-button {
  margin-top: 30px;
  padding: 8px 16px;
  background-color: #f59e0b;
}

.reset-button:hover {
  background-color: #d97706;
}
</style>
