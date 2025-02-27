<!-- <script setup lang="ts">
/**
 * @file MathJax.vue
 */
import { computed, toRefs } from 'vue'
import { useRenderMathInElement } from '~/composibles/useRenderMathInElement' // Load CSS file as a string via ?inline
import { asciiToLatexImproved } from '~/utils/asciiToLatexImproved'

const props = withDefaults(defineProps<{
  content?: string
  isWordProblem?: boolean
  isLatex?: boolean
}>(), {
  isWordProblem: false,
  isLatex: false, // default ascii
})

// const mf = ref<MathfieldElement | null>(null)
const { content } = toRefs(props)


const betterContent = computed(() => {
  if (!content.value)
    return ''
  if (props.isLatex)
    return content.value

  return asciiToLatexImproved(content.value, { isWordProblem: props.isWordProblem })
})

const elementUniqueId = computed(() => `mathJax-${Math.random().toString(36).substring(7)}`)
useRenderMathInElement(elementUniqueId, betterContent)
</script>

<template>
  <div :id="elementUniqueId">
    {{ betterContent }}
  </div>
</template>

<style scoped lang="postcss">

</style> -->
