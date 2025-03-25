<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useMathProblemStore } from '~/store/mathProblemStore'
import ProblemNavigator from '~/components/Core/ProblemNavigator.vue'
import { useToggle } from '@vueuse/core'
import type { MultipleChoiceOption } from '~/types/mathProblemStoreTypes'

const store = useMathProblemStore()

// Local state that will be passed to components
const problems = computed(() => {
  const allProblems = store.problems
  // return with the calculated properties: isAnswered, isCorrect on each problem
  return allProblems.map((problem) => {
    return {
      ...problem,
      isAnswered: store.getIsProblemAnswered(problem.id),
      isCorrect: store.getIsProblemCorrect(problem.id),
      correctAnswer: store.getCorrectOptionForProblem(problem.id)?.text || '',
    }
  })
})
watch(problems, () => {
  console.log('Problems updated:', problems.value)
}, { deep: true })
const currentProblemIndex = ref(0)

// Settings for the demo
const showProgressBar = ref(true)
const toggleProgressBar = useToggle(showProgressBar)
const skippable = ref(false)
const toggleSkippable = useToggle(skippable)
const autoAdvance = ref(false)
const toggleAutoAdvance = useToggle(autoAdvance)
const showConfetti = ref(true)
const toggleConfetti = useToggle(showConfetti)

// Reset all problems
const resetProblems = () => {
  store.resetProblems()
  currentProblemIndex.value = 0
}

// Reset problems when component mounts
onMounted(() => {
  resetProblems()
})

// Handle navigation
const handleNext = () => {
  if (currentProblemIndex.value < problems.value.length - 1)
    currentProblemIndex.value++
}

const handlePrevious = () => {
  if (currentProblemIndex.value > 0)
    currentProblemIndex.value--
}

const navigateToIndex = (index: number) => {
  currentProblemIndex.value = index
}

// Handle submissions
const handleAnswerSubmitted = (problemId: string, answer: MultipleChoiceOption) => {
  store.submitAnswer(problemId, answer.id)
}

const handleOptionSelected = (problemId: string, option: MultipleChoiceOption) => {
  // Optional: track selections here for analytics
  console.log(`Problem ${problemId}: option ${option} selected`)
}

// Handle completion
const handleComplete = () => {
  console.log('All problems complete!')
}


const handleReset = () => {
  resetProblems()
}
</script>

<template>
  <div class="math-problem-demo">
    <div class="demo-header">
      <h1>Math Problems Demo</h1>
      <p>A flexible navigation system for math activities</p>

      <div class="demo-controls">
        <div class="settings-toggles">
          <label class="toggle">
            <input v-model="showProgressBar" type="checkbox" @click="toggleProgressBar()">
            <span class="toggle-label">Show Progress Bar</span>
          </label>

          <label class="toggle">
            <input v-model="skippable" type="checkbox" @click="toggleSkippable()">
            <span class="toggle-label">Allow Skipping</span>
          </label>

          <label class="toggle">
            <input v-model="autoAdvance" type="checkbox" @click="toggleAutoAdvance()">
            <span class="toggle-label">Auto Advance</span>
          </label>

          <label class="toggle">
            <input v-model="showConfetti" type="checkbox" @click="toggleConfetti()">
            <span class="toggle-label">Show Confetti</span>
          </label>
        </div>

        <button class="reset-button" @click="handleReset">
          Reset All Problems
        </button>
      </div>
      <!--
      This section is commented out for now, but I'll leave it here for future reference :)
      <div class="features">
        <h2>Features</h2>
        <ul>
          <li>Animated transitions between problems</li>
          <li>Flexible problem types (expandable architecture)</li>
          <li>Clear success/failure feedback</li>
          <li>Progress tracking with confetti celebration</li>
          <li>Skip option for unanswered problems</li>
          <li>Auto-advance when correct (optional)</li>
          <li>Interactive progress dots for direct navigation</li>
          <li>Explanation display after answering</li>
        </ul>
      </div>
    </div> -->
      <div class="problem-navigator-container">
        <ProblemNavigator
          :problems="problems"
          :current-problem-index="currentProblemIndex"
          :show-progress-bar="showProgressBar"
          :skippable="skippable"
          :auto-advance="autoAdvance"
          :show-confetti="showConfetti"
          @next="handleNext"
          @previous="handlePrevious"
          @navigate="navigateToIndex"
          @answer-submitted="handleAnswerSubmitted"
          @option-selected="handleOptionSelected"
          @complete="handleComplete"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.problem-navigator-container {
  width: 100%;
  height: 100%;
}

.math-problem-demo {
  min-height: 100vh;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--accent);
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

p {
  color: var(--secondary-lighter);
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.demo-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.settings-toggles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  cursor: pointer;
}

.toggle-label {
  font-size: 1rem;
  color: var(--secondary);
}

.reset-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.problem-navigator {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.demo-second-header {
  margin-top: auto;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .settings-toggles {
    gap: 1rem;
  }

  .toggle-label {
    font-size: 0.9rem;
  }
}
</style>
