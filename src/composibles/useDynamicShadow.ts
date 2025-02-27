import type { Ref } from 'vue'
import { watch } from 'vue'
import { useThrottleFn } from '@vueuse/core'

/**
 * A performant composable to calculate and apply dynamic shadows based on a light source.
 *
 * @param element - The target element to apply the shadow.
 * @param position - Reactive object representing the position of the box `{ x: number, y: number }`.
 * @param lightSource - Reactive object representing the position of the light source `{ x: number, y: number }`.
 */
export function useDynamicShadow(
  element: Ref<HTMLElement | null>,
  position: Ref<{ x: number, y: number }>,
  lightSource: Ref<{ x: number, y: number }>,
) {
  // Function to calculate the shadow
  const _calculateShadow = (boxPos: { x: number, y: number }, lightPos: { x: number, y: number }) => {
    const dx = boxPos.x - lightPos.x
    const dy = boxPos.y - lightPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Normalize and scale the shadow offset
    const directionScale = 20 // Larger scale for more prominent direction
    const shadowX = Math.round((dx / distance) * directionScale) || 0
    const shadowY = Math.round((dy / distance) * directionScale) || 0

    const blur = Math.min(distance / 15, 3) // Tie blur to distance for softer edges
    const opacity = Math.max(1 - distance / 300, 0.4) // Stronger opacity closer to the source

    return `${-shadowX}px ${-shadowY}px ${blur}px rgba(0, 0, 0, ${opacity})`
  }

  // Apply the shadow directly to the element
  const applyShadow = useThrottleFn(() => {
    if (element.value) {
      const shadow = _calculateShadow(position.value, lightSource.value)
      element.value.style.boxShadow = shadow
    }
  }, 1) // Throttle to ~60 FPS (16ms)

  // Watch for changes in position or light source and apply the shadow
  watch([position, lightSource], applyShadow, { immediate: true })

  return {
    applyShadow, // Exposed for manual invocation if needed
  }
}
