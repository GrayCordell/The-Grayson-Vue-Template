import { computed, ref } from 'vue'

export function useHighlightNumbers(initialText = '') {
  const text = ref(initialText)

  const highlightedText = computed(() => {
    // Regular expression to match all numbers
    const regex = /(\d+)/g
    // Replace numbers with a span wrapping them
    return text.value?.replace?.(regex, '<span class="number">$1 </span>')
  })

  return { text, highlightedText }
}
