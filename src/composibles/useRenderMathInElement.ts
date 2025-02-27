// import type { Ref } from 'vue'
// import { onMounted, onUpdated } from 'vue'
// import { renderMathInElement } from 'mathlive'
// import { watchDebounced } from '@vueuse/core'


// export function useRenderMathInElement(elementId: Ref<string>, contentString?: Ref<string>) {
//   const renderMath = () => {
//     const element = document.getElementById(elementId.value)
//     if (element)
//       renderMathInElement(element)
//   }
//   onMounted(() => {
//     if (elementId?.value)
//       renderMath()
//   })

//   onUpdated(() => {
//     if (elementId?.value)
//       renderMath()
//   })

//   if (contentString) {
//     watchDebounced(contentString, (newVal) => {
//       if (newVal && elementId?.value)
//         renderMath()
//     }, { debounce: 1000 })
//   }
// }
