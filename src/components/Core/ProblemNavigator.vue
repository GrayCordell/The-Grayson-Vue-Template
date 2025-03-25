<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTransition } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import clickSound from '~/assets/13SwitchClickSound.ogg'
import successSound from '~/assets/itemGetHappySound.mp3'
import FunProgressBarWrapper from './FunProgressBarWrapper.vue'
import type { MultipleChoiceOption, MultipleChoiceProblemType } from '~/types/mathProblemStoreTypes'
import MultipleChoiceProblem from './MultipleChoiceProblem.vue'

const props = withDefaults(defineProps<{
  problems: (MultipleChoiceProblemType & {
    isAnswered: boolean
    isCorrect: boolean
  })[]
  currentProblemIndex: number
  showConfetti?: boolean
  showProgressBar?: boolean
  autoAdvance?: boolean
  skippable?: boolean
}>(), {
  showConfetti: true,
  showProgressBar: true,
  autoAdvance: false,
  skippable: false,
})

const emit = defineEmits<{
  next: []
  previous: []
  navigate: [index: number]
  answerSubmitted: [problemId: string, answer: MultipleChoiceOption]
  optionSelected: [problemId: string, option: MultipleChoiceOption]
  complete: []
}>()

const { play: playClick } = useSound(clickSound, { volume: 0.2 })
const { play: playSuccess } = useSound(successSound, { volume: 0.3 })

// Animation states
const isTransitioning = ref(false)
const transitionDirection = ref<'left' | 'right'>('right')
const slideOffset = ref(0)
const slideAnimation = useTransition(slideOffset, {
  duration: 400,
  transition: [0.25, 0.1, 0.25, 1.0],
})

// Progress bar reference
const progressBarRef = ref<{ setProgress: (value: number) => void } | null>(null)

// Computed properties
const currentProblem = computed(() => props.problems[props.currentProblemIndex])
const isCorrect = computed(() => currentProblem.value.isCorrect)
const hasSubmittedAnswer = computed(() => currentProblem.value.isAnswered)

const progress = computed(() => {
  const answeredCount = props.problems.filter(p => p.isAnswered).length
  return Math.round((answeredCount / props.problems.length) * 100)
})
const canGoNext = computed(() => props.currentProblemIndex < props.problems.length - 1)
const canGoPrevious = computed(() => props.currentProblemIndex > 0)
const isCurrentProblemAnswered = computed(() =>
  props.problems[props.currentProblemIndex]?.isAnswered || false,
)

// Watch for progress changes
watch(progress, (newProgress) => {
  if (props.showProgressBar && progressBarRef.value) {
    progressBarRef.value.setProgress(newProgress)
  }

  if (newProgress === 100) {
    playSuccess()
    emit('complete')
  }
})

// Navigate to next problem with animation
const goToNextProblem = () => {
  if (!canGoNext.value)
    return

  transitionDirection.value = 'right'
  isTransitioning.value = true
  slideOffset.value = 100

  playClick()

  setTimeout(() => {
    emit('next')
    slideOffset.value = -100

    setTimeout(() => {
      isTransitioning.value = false
      slideOffset.value = 0
    }, 50)
  }, 400)
}

// Navigate to previous problem with animation
const goToPreviousProblem = () => {
  if (!canGoPrevious.value)
    return

  transitionDirection.value = 'left'
  isTransitioning.value = true
  slideOffset.value = -100

  playClick()

  setTimeout(() => {
    emit('previous')
    slideOffset.value = 100

    setTimeout(() => {
      isTransitioning.value = false
      slideOffset.value = 0
    }, 50)
  }, 400)
}

// Handle option selection
const handleOptionSelected = (option: MultipleChoiceOption) => {
  // Emit the selected option
  emit('optionSelected', currentProblem.value.id, option)
}


//
// Handle answer submission. (Emit.)
//
let lastSubmittedId: string | null = null
const handleAnswerSubmitted = (answer: MultipleChoiceOption) => {
  emit('answerSubmitted', currentProblem.value.id, answer)
  lastSubmittedId = currentProblem.value.id
}
// Wait for the problem to update.
watch([hasSubmittedAnswer, isCorrect], () => {
  if (!currentProblem.value.id || !lastSubmittedId || lastSubmittedId !== currentProblem.value.id) {
    lastSubmittedId = null
    return
  }
  if (!isCorrect.value)
    return

  // Then we have just submitted an answer and its correct
  playSuccess()
  lastSubmittedId = null
  if (props.autoAdvance) {
    setTimeout(() => {
      goToNextProblem()
    }, 1000)
  }
})

//
//
//

// Determine if next button should be enabled
const isNextEnabled = computed(() => {
  if (props.skippable)
    return canGoNext.value
  return isCurrentProblemAnswered.value && canGoNext.value
})

// Handle navigation to specific problem
const navigateToIndex = (index: number) => {
  // We need to see if they have already answered it before allowing them to navigate
  if (props.problems[index].isAnswered || props.skippable) {
    playClick()
    emit('navigate', index)
  }
}

// Handle completion
const handleComplete = () => {
  emit('complete')
}
</script>

<template>
  <div class="problem-navigator">
    <!-- Progress bar -->
    <FunProgressBarWrapper
      v-if="showProgressBar"
      ref="progressBarRef"
      label="Progress"
      position="top-right"
      :enable-confetti="showConfetti"
      @complete="handleComplete"
    />

    <!-- Problem content area -->
    <div class="problem-container">
      <!-- Current problem display with animation -->
      <div
        class="problem-content"
        :class="{
          'is-transitioning': isTransitioning,
          [`slide-${transitionDirection}`]: isTransitioning,
        }"
        :style="isTransitioning ? { transform: `translateX(${slideAnimation}%)`, minHeight: '350px', width: '100%' } : {}"
      >
        <div v-if="currentProblem" class="problem-frame">
          <div class="problem-number">
            Problem {{ currentProblemIndex + 1 }} of {{ problems.length }}
          </div>

          <!-- Switch between problem types -->
          <div class="problem-body">
            <MultipleChoiceProblem
              v-if="currentProblem.type === 'multiple-choice'"
              v-bind="currentProblem"
              @selected="handleOptionSelected"
              @answer-submitted="handleAnswerSubmitted"
            />
            <!-- Other problem types can be added here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <div class="navigation-controls">
      <button
        class="nav-button prev-button"
        :class="{ disabled: !canGoPrevious }"
        :disabled="!canGoPrevious"
        @click="goToPreviousProblem"
      >
        <div class="arrow left-arrow" />
        <span class="button-label">Previous</span>
      </button>

      <div class="progress-indicator">
        <div
          v-for="(problem, index) in problems"
          :key="index"
          class="progress-dot"
          :class="{
            active: index === currentProblemIndex,
            completed: problem.isAnswered,
            correct: problem.isCorrect,
            incorrect: problem.isAnswered && !problem.isCorrect,
          }"
          @click="navigateToIndex(index)"
        />
      </div>

      <button
        class="nav-button next-button"
        :class="{
          'disabled': !isNextEnabled,
          'skip-button': !isCurrentProblemAnswered && props.skippable,
        }"
        :disabled="!isNextEnabled"
        @click="goToNextProblem"
      >
        <span class="button-label">{{ !isCurrentProblemAnswered && props.skippable ? 'Skip' : 'Next' }}</span>
        <div class="arrow right-arrow" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.problem-navigator {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.problem-container {
  flex: 1;
  position: relative;
  overflow-x: hidden;
  padding: 20px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
}

.problem-content {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  height: 100%;
}

.is-transitioning {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.problem-frame {
  background-color: var(--primary);
  border-radius: 16px;
  padding: 30px;
  flex: 1;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 2px solid var(--accent);
  min-height: 350px;
  height: 100%;
}

.problem-number {
  font-size: 1rem;
  color: var(--secondary-lighter);
  margin-bottom: 20px;
  font-weight: bold;
}

.problem-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--primary);
  border-top: 1px solid var(--primary-darker);
  flex-wrap: wrap;
  gap: 15px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 50px;
  background-color: var(--accent);
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.nav-button:hover:not(.disabled) {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skip-button {
  background-color: var(--primary-darker-grey);
}

.skip-button:hover:not(.disabled) {
  background-color: var(--grey);
}

.arrow {
  width: 12px;
  height: 12px;
  border-top: 3px solid white;
  border-right: 3px solid white;
  margin: 0 8px;
  flex-shrink: 0;
}

.left-arrow {
  transform: rotate(-135deg);
}

.right-arrow {
  transform: rotate(45deg);
}

.progress-indicator {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 120px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .navigation-controls {
    flex-direction: column;
    padding: 15px;
  }

  .nav-button {
    width: 100%;
    min-width: auto;
  }

  .progress-indicator {
    order: -1;
    margin-bottom: 10px;
    width: 100%;
  }
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--primary-darker);
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-dot:hover {
  transform: scale(1.2);
}

.progress-dot.active {
  background-color: var(--accent);
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(65, 110, 189, 0.3);
}

.progress-dot.completed {
  background-color: var(--accent-hover);
}

.progress-dot.correct {
  background-color: #4ade80;
}

.progress-dot.incorrect {
  background-color: #ef4444;
}

/* Animation classes */
.slide-right {
  animation: slideOutRight 0.4s forwards;
}

.slide-left {
  animation: slideOutLeft 0.4s forwards;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
