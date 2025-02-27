<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue'

// Component: AutoExpandingInput
// Description: An input that expands as the user types, adjusting its height

const props = withDefaults(defineProps<{
  minWidth?: string
  modelValue: string
}>(), {
  minWidth: '20ch',
})
const emit = defineEmits<{
  (event: 'update:modelValue', newValue: string): void
}>()
const { minWidth } = toRefs(props)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const inputText = ref(props.modelValue) // Initialize from external modelValue prop

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (inputText.value !== newValue)
    inputText.value = newValue
})

// Emit changes when inputText updates
watch(inputText, (newValue) => {
  emit('update:modelValue', newValue)
  adjustInputHeight()
})

// Function to adjust the height of the input based on its content
function adjustInputHeight() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto' // Reset height to shrink if content is removed
    inputRef.value.style.height = `${inputRef.value.scrollHeight}px`
  }
}

// Adjust the input height on mount to accommodate the initial value
onMounted(() => {
  adjustInputHeight()
})

const setInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  inputText.value = target.value
}
</script>

<template>
  <textarea ref="inputRef"
            :value="inputText"
            :style="{ minWidth, resize: 'none', overflow: 'hidden' }"
            rows="1"
            @input="setInput"
  />
</template>
