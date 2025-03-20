<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import FunProgressBarWrapper from '../components/Core/FunProgressBarWrapper.vue'

// Get reference to progress bar component for programmatic control
const progressBarRef = useTemplateRef('progressBarRef')
const progressBarRef2 = useTemplateRef('progressBarRef2')
const progressBarRef3 = useTemplateRef('progressBarRef3')

// Demo progress values
const demoProgress = ref(0)
const demoProgress2 = ref(0)

// Simulate loading progress
const simulateProgress = () => {
  demoProgress.value = 0
  demoProgress2.value = 0

  // Update the first progress bar
  const interval = setInterval(() => {
    demoProgress.value += 5

    // Update the component with current value
    if (progressBarRef.value) {
      progressBarRef.value.setProgress(demoProgress.value)
    }

    // Start the second progress bar when first reaches 30%
    if (demoProgress.value >= 30 && progressBarRef2.value) {
      demoProgress2.value += 8
      progressBarRef2.value.setProgress(demoProgress2.value)
    }

    // Start the third progress bar when second reaches 60%
    if (demoProgress2.value >= 60 && progressBarRef3.value) {
      progressBarRef3.value.setProgress(70)
    }

    // Stop when complete
    if (demoProgress.value >= 100) {
      clearInterval(interval)
    }
  }, 200)
}

// Handle completion event
const handleComplete = (barName: string) => {
  console.log(`${barName} progress complete!`)
}

// Auto-start simulation on mount
onMounted(() => {
  simulateProgress()
})
</script>

<template>
  <section class="demo-view">
    <div class="content">
      <h1>Progress Bar Demo</h1>
      <p>
        This page demonstrates the FunProgressBarWrapper component, a fun and animated
        progress indicator that can be positioned in any corner of the viewport.
      </p>

      <div class="controls">
        <button class="restart-button" @click="simulateProgress">
          Restart Progress Simulation
        </button>

        <div class="position-controls">
          <button @click="progressBarRef?.show()">
            Show
          </button>
          <button @click="progressBarRef?.hide()">
            Hide
          </button>
          <button @click="progressBarRef?.minimize()">
            Minimize
          </button>
          <button @click="progressBarRef?.maximize()">
            Maximize
          </button>
          <button @click="progressBarRef?.toggle()">
            Toggle Size
          </button>
          <button @click="progressBarRef?.reset()">
            Reset
          </button>
        </div>
      </div>

      <div class="features">
        <h2>Features</h2>
        <ul>
          <li>Animated progress tracking with smooth transitions</li>
          <li>Fun confetti celebration on completion</li>
          <li>Emoji indicators that change based on progress</li>
          <li>Milestone messages for motivation</li>
          <li>Multiple theme options (default, math, success)</li>
          <li>Customizable position (all four corners)</li>
          <li>Minimize/maximize instead of completely hiding</li>
          <li>Auto-hide option with configurable delay</li>
        </ul>
      </div>
    </div>

    <!-- Progress bars positioned in different corners -->
    <FunProgressBarWrapper
      ref="progressBarRef"
      label="Loading Assets"
      position="top-right"
      @complete="handleComplete('Default')"
    />

    <FunProgressBarWrapper
      ref="progressBarRef2"
      label="Math Progress"
      position="top-left"
      @complete="handleComplete('Math')"
    />

    <FunProgressBarWrapper
      ref="progressBarRef3"
      label="Task Status"
      position="bottom-right"
      @complete="handleComplete('Success')"
    />
  </section>
</template>

<style scoped lang="postcss">
.demo-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content {
  background-color: var(--primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

p {
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: var(--secondary);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
}

button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
}

.restart-button {
  background-color: #4ade80;
}

.restart-button:hover {
  background-color: #22c55e;
}

.position-controls {
  display: flex;
  gap: 0.5rem;
}

.features {
  margin-top: 3rem;
}

h2 {
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
}

li::before {
  content: '✓';
  color: #4ade80;
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>
