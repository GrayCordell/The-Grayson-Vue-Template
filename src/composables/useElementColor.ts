import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { throttle } from 'lodash-es'

export function useSvgColorObserver(svgElement: Ref<SVGGeometryElement | undefined>, callback: (mutation: string) => void, throttleNumber: number = 1000) {
  const throttledCallback = throttle(callback, throttleNumber)

  onMounted(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          // @ts-expect-error getAttribute exists
          const newColor = mutation.target?.getAttribute?.('style')?.split?.(' ')?.[1]?.replace?.(';', '') || '' // 'black', 'red', etc
          throttledCallback(newColor)
        }
      })
    })

    // Configuration of the observer:
    const config = { attributes: true, attributeFilter: ['style'] }

    // Start observing the target node for configured mutations
    if (svgElement.value)
      observer.observe(svgElement.value, config)

    // Cleanup function
    onUnmounted(() => {
      observer.disconnect()
      throttledCallback.cancel() // Cancel any throttled invocation.
    })
  })

  return { svgElement }
}
