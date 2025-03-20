<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useTransition } from '@vueuse/core'
import { useSound } from '@vueuse/sound'
import sfx from '~/assets/itemGetHappySound.mp3'

const props = withDefaults(defineProps<{
  progress?: number /* Current progress value (0-100) */
  label?: string /* Optional custom label text */
  showPercentage?: boolean /* Show percentage number */
  enableConfetti?: boolean /* Enable confetti animation when reaching 100% */
  showEmojis?: boolean /* Show emoji indicators along the progress bar */
  enableSound?: boolean /* Play sound effect when reaching 100% */
}>(), {
  progress: 0,
  label: '',
  showPercentage: true,
  enableConfetti: true,
  showEmojis: true,
  enableSound: true,
})

const emit = defineEmits<{
  (event: 'complete'): void
}>()

// Clamp progress value between 0 and 100
const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress)))

// Animated progress value with smooth transitions
const animatedProgress = useTransition(clampedProgress, {
  duration: 600,
  transition: [0.25, 0.1, 0.25, 1.0], // Cubic bezier curve for a nice bounce effect
})

// State for confetti animation
const showConfetti = ref(false)
const confettiCount = 50
const confettiElements = ref<Array<{ id: number, x: number, y: number, size: number, color: string, rotation: number }>>([])

// State for emoji indicators and milestone rewards
const emojis = ['🌱', '🌿', '🌳', '🌈', '🎉']
const milestoneMessages = [
  'Getting started...',
  'Making progress!',
  'Almost there!',
  'Great job!',
  'Excellent work!',
]

const currentEmoji = computed(() => {
  const progressIndex = Math.floor(clampedProgress.value / 25)
  return emojis[Math.min(progressIndex, emojis.length - 1)]
})

const milestoneMessage = computed(() => {
  const progressIndex = Math.floor(clampedProgress.value / 25)
  return milestoneMessages[Math.min(progressIndex, milestoneMessages.length - 1)]
})

// Pulse animation when progress changes significantly
const isPulsing = ref(false)
const previousProgress = ref(props.progress)

// Generate random confetti particles
const generateConfetti = () => {
  confettiElements.value = Array.from({ length: confettiCount }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 60 - 30,
    size: Math.random() * 8 + 4,
    color: [
      '#416ebd',
      '#4ade80',
      '#f59e0b',
      '#ec4899',
      '#8b5cf6',
      '#3dc2ff',
      '#7EC8E3',
      '#6599cb',
    ][Math.floor(Math.random() * 8)],
    rotation: Math.random() * 360,
  }))
}
const { play } = useSound(sfx, { volume: 0.2, playbackRate: 2 })

// Track progress changes and trigger milestone/completion effects
watch(() => props.progress, (newValue) => {
  // Trigger pulse animation when progress changes significantly
  if (Math.abs(newValue - previousProgress.value) > 10) {
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 500)
  }

  // Check for milestone achievements (25%, 50%, 75%, 100%)
  const newMilestone = Math.floor(newValue / 25)
  const oldMilestone = Math.floor(previousProgress.value / 25)

  if (newMilestone > oldMilestone) {
    // Trigger pulse animation for all milestones
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 500)

    // Special effects for 100% completion
    if (newValue >= 100 && props.enableConfetti) {
      showConfetti.value = true

      generateConfetti()

      if (props.enableSound)
        play()

      emit('complete')

      // Hide confetti after animation completes
      setTimeout(() => {
        showConfetti.value = false
      }, 3000)
    }
  }

  previousProgress.value = newValue
})

onMounted(() => {
  // Initial animation on mount
  isPulsing.value = true
  setTimeout(() => {
    isPulsing.value = false
  }, 500)
})
</script>

<template>
  <div class="fun-progress-container" :class="{ 'is-complete': clampedProgress >= 100 }">
    <div v-if="label" class="progress-label">
      {{ label }}
      <span v-if="showEmojis" class="progress-emoji">{{ currentEmoji }}</span>
    </div>
    <div v-if="animatedProgress > 0" class="progress-milestone">
      {{ milestoneMessage }}
    </div>

    <div
      class="progress-bar-container"
    >
      <div
        class="progress-bar-fill"
        :class="{ 'is-pulsing': isPulsing }"
        :style="{
          width: `${animatedProgress}%`,
        }"
      >
        <div class="progress-glow" />
      </div>

      <div v-if="showPercentage" class="progress-percentage">
        {{ Math.round(animatedProgress) }}%
      </div>
    </div>

    <!-- Confetti animation when completed -->
    <div v-if="showConfetti" class="confetti-container">
      <div
        v-for="particle in confettiElements"
        :key="particle.id"
        class="confetti-particle"
        :style="{
          left: `${particle.x}%`,
          top: `${particle.y}px`,
          width: `${particle.size}px`,
          height: `${particle.size * 0.4}px`,
          backgroundColor: particle.color,
          transform: `rotate(${particle.rotation}deg)`,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fun-progress-container {
  position: relative;
  width: 200px;
  padding: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--secondary);
}

.progress-milestone {
  text-align: center;
  font-size: 12px;
  margin-top: 4px;
  font-style: italic;
  color: var(--accent);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

.progress-emoji {
  font-size: 16px;
  margin-left: 6px;
  transition: all 0.3s ease;
  animation: bounce 1s ease infinite;
}

.progress-bar-container {
  background-color: #e1f5fe;
  border-color: #6599cb;
  position: relative;
  height: 16px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #6599cb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.progress-bar-fill {
  background-color: #7ec8e3;
  position: relative;
  height: 100%;
  width: 0;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.progress-bar-fill.is-pulsing {
  animation: pulse 0.5s ease;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
  border-radius: 8px 8px 0 0;
}

.progress-percentage {
  color: #406ebd;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
}

.is-complete {
  transform: scale(1.05);
}

.is-complete .progress-bar-container {
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.confetti-particle {
  position: absolute;
  opacity: 0;
  border-radius: 2px;
  animation: confetti-fall 3s ease-in-out forwards;
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

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) rotate(720deg);
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
