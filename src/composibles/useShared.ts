import { createSharedComposable, useActiveElement, useWindowSize } from '@vueuse/core'

export const useSharedActiveElement = createSharedComposable(useActiveElement)

export const useSharedWindowSize = createSharedComposable(useWindowSize)
