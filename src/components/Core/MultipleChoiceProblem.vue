<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MultipleChoiceExplanation, MultipleChoiceOption, MultipleChoiceQuestion } from '~/types/mathProblemStoreTypes'

const props = defineProps<{
  id: string
  question: MultipleChoiceQuestion
  options: MultipleChoiceOption[]
  explanation?: MultipleChoiceExplanation
  isAnswered: boolean
  userAnswer?: MultipleChoiceOption
  isCorrect: boolean
}>()
const emit = defineEmits<{
  answerSubmitted: [answer: MultipleChoiceOption]
}>()
const isSubmitted = computed(() => props.isAnswered)
const isCorrect = computed(() => props.isCorrect)


// const slots = defineSlots<{
//   question: () => any
// }>()

const selectedOption = ref<MultipleChoiceOption | null>(null)


// Animation states
const isOptionAnimating = ref<Record<string, boolean>>({})
const showExplanation = ref(false)


// On Problem change.
const problemId = computed(() => props.id)
watch((problemId), () => {
  // Reset selected option and explanation between changing problems
  selectedOption.value = null
  showExplanation.value = false

  // If the problem already has an answer, set it.
  if (props.isAnswered && props.userAnswer) {
    selectedOption.value = props.userAnswer || null
    showExplanation.value = true
  }
}, { immediate: true }) // <-- Run immediately at start and on any problem change


// Handle option selection
const selectOption = (option: MultipleChoiceOption) => {
  if (isSubmitted.value)
    return

  selectedOption.value = option

  // Add slight animation effect when selecting
  isOptionAnimating.value[option.id] = true
  setTimeout(() => {
    isOptionAnimating.value[option.id] = false
  }, 300)
}

const submitAnswer = () => {
  if (!selectedOption.value || isSubmitted.value)
    return

  // Emit answer submitted event
  emit('answerSubmitted', selectedOption.value!)


  // Show the explanation after submission
  setTimeout(() => {
    showExplanation.value = true
  }, 500)
}

// Determine CSS classes for options
const getOptionClasses = (option: MultipleChoiceOption) => {
  if (!isSubmitted.value) {
    return {
      selected: option === selectedOption.value,
      animating: isOptionAnimating.value[option.id],
    }
  }

  if (option.isTheCorrectOption)
    return { correct: true }
  else if (option.id === selectedOption.value?.id)
    return { incorrect: true }

  return { unselected: true }
}
</script>

<template>
  <div class="mc-problem">
    <!-- Question -->
    <div class="question-container">
      <h2 class="question">
        {{ question.text }}
      </h2>
    </div>

    <!-- Options -->
    <div class="options-container">
      <div
        v-for="option in options"
        :key="option.id"
        class="option"
        :class="getOptionClasses(option)"
        @click="selectOption(option)"
      >
        <div class="option-content">
          <div class="check-indicator">
            <div v-if="isSubmitted && option.isTheCorrectOption" class="check-icon">
              ✓
            </div>
            <div v-else-if="isSubmitted && option.id === selectedOption?.id" class="x-icon">
              ✗
            </div>
          </div>
          <span>{{ option.text }}</span>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <div class="actions">
      <button
        v-if="!isSubmitted"
        class="submit-button"
        :disabled="!selectedOption"
        @click="submitAnswer"
      >
        Submit Answer
      </button>

      <!-- Result message -->
      <div
        v-else
        class="result-message"
        :class="{ 'correct-message': isCorrect, 'incorrect-message': !isCorrect }"
      >
        <div class="result-icon">
          {{ isCorrect ? '✓' : '✗' }}
        </div>
        <div class="result-text">
          {{ isCorrect ? 'Correct!' : 'Not quite right.' }}
        </div>
      </div>
    </div>

    <!-- Explanation (shows after submission) -->
    <div v-if="showExplanation && isSubmitted && explanation" class="explanation-container">
      <div class="explanation">
        <h3>Explanation:</h3>
        <p>{{ explanation.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.mc-problem {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  flex: 1;
  overflow-y: auto;
}

.question-container {
  text-align: center;
  margin-bottom: 20px;
}

.question {
  font-size: 1.5rem;
  color: var(--secondary);
  margin: 0;
  padding: 0;
  line-height: 1.4;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.option {
  padding: 16px 20px;
  border-radius: 12px;
  background-color: var(--primary-darker);
  border: 2px solid var(--primary-darker-grey);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  word-break: break-word;
}

.option:hover:not(.correct):not(.incorrect):not(.unselected) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.check-indicator {
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.option.selected {
  background-color: var(--dnd-bg-special);
  border-color: var(--accent);
  transform: scale(1.02);
  font-weight: bold;
}

.option.animating {
  animation: pulse 0.3s ease;
}

.option.correct {
  background-color: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
  cursor: default;
}

.option.incorrect {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  cursor: default;
}

.option.unselected {
  opacity: 0.6;
  cursor: default;
}

.check-icon {
  color: #4ade80;
  font-size: 1.5rem;
  font-weight: bold;
}

.x-icon {
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.submit-button {
  padding: 12px 32px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: bold;
  animation: fadeIn 0.5s ease;
}

.correct-message {
  background-color: rgba(74, 222, 128, 0.2);
  color: #15803d;
}

.incorrect-message {
  background-color: rgba(239, 68, 68, 0.2);
  color: #b91c1c;
}

.result-icon {
  font-size: 1.5rem;
}

.explanation-container {
  margin-top: 10px;
  animation: slideUp 0.5s ease;
}

.explanation {
  background-color: var(--dnd-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid var(--accent);
}

.explanation h3 {
  margin-top: 0;
  color: var(--secondary);
  font-size: 1.1rem;
}

.explanation p {
  margin-bottom: 0;
  color: var(--secondary-lighter);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
