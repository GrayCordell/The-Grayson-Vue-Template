import type { Ref } from 'vue'
import { computed } from 'vue'

interface UseDynamicFontSizeOptions {
  minFontSize?: number
  maxFontSize?: number
  baseLength?: number | null | undefined // default is middle of min and max
  exponent?: number
}

interface UseDynamicFontSizeOptions {
  minFontSize?: number
  maxFontSize?: number
  baseLength?: number | null // default is middle of min and max
  exponent?: number // default: 1 (linear scaling)
}

export function useDynamicFontSize(
  text: Ref<string>,
  {
    minFontSize = 20,
    maxFontSize = 66,
    baseLength = null, // default will be middle of min and max if not provided
    exponent = 1, // default 1 => linear
  }: UseDynamicFontSizeOptions = {},
) {
  // Validate inputs
  if (minFontSize < 0 || maxFontSize < 0 || minFontSize > maxFontSize) {
    throw new Error('Invalid font size range')
  }

  // Default `baseLength` to middle of min and max if not provided
  const defaultBaseLength = (minFontSize + maxFontSize) / 2
  baseLength = baseLength || defaultBaseLength

  // Validate baseLength
  if (baseLength <= 0) {
    throw new Error('baseLength must be greater than 0')
  }

  const dynamicFontSize = computed(() => {
    const length = text.value.length

    if (length === 0) {
      return `${maxFontSize}px`
    }

    // Length ratio
    const ratio = length / baseLength

    // Apply exponent for non-linear scaling
    const factor = Math.max(0, ratio ** exponent) // Clamp ratio to 0+

    const rawSize = maxFontSize - (maxFontSize - minFontSize) * factor

    // Clamp final size
    const clampedSize = Math.min(Math.max(rawSize, minFontSize), maxFontSize)

    return `${clampedSize}px`
  })

  return {
    dynamicFontSize,
  }
}


/*

export interface UseScaleFontSizeOptions {
  minFontSize?: number
  maxFontSize?: number
  /!**
   * A “base width” that represents where the scaling ratio = 1.0 for width.
   *!/
  baseWidth?: number
  /!**
   * A “base height” that represents where the scaling ratio = 1.0 for height.
   *!/
  baseHeight?: number
  /!**
   * If `true`, the ratio is taken only from width.
   *!/
  useWidthOnly?: boolean
  /!**
   * If `true`, the ratio is taken only from height.
   *!/
  useHeightOnly?: boolean
}

export function useScaleFontSize(
  /!**
   * Reactive reference to the parent element's current width.
   *!/
  parentWidth: Ref<number>,
  /!**
   * Reactive reference to the parent element's current height.
   *!/
  parentHeight: Ref<number>,
  {
    minFontSize = 16,
    maxFontSize = 80,
    baseWidth = 600,
    baseHeight = 400,
    useWidthOnly,
    useHeightOnly,
  }: UseScaleFontSizeOptions = {},
) {
  const dynamicFontSize = computed(() => {
    const widthVal = parentWidth.value
    const heightVal = parentHeight.value

    // If no size available (0 or undefined), fall back to min
    if (!widthVal || !heightVal) {
      return `${minFontSize}px`
    }

    // Compute a ratio of how large the parent is relative to a "base" dimension
    let ratio: number
    if (useWidthOnly) {
      ratio = widthVal / baseWidth
    }
    else if (useHeightOnly) {
      ratio = heightVal / baseHeight
    }
    else {
      // By default, we use the *smaller* ratio of the two dimensions
      // so text never overflows its container in either dimension.
      const ratioWidth = widthVal / baseWidth
      const ratioHeight = heightVal / baseHeight
      ratio = Math.min(ratioWidth, ratioHeight)
    }

    // Interpolate between minFontSize and maxFontSize
    let size = minFontSize + (maxFontSize - minFontSize) * ratio

    // Clamp final size
    size = Math.max(minFontSize, Math.min(size, maxFontSize))
    return `${size}px`
  })

  return {
    dynamicFontSize,
  }
}
*/
