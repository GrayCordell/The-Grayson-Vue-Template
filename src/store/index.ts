import { useBasicStore } from '~/store/basicStore'

/**
 * @fileoverview
 * Place new Pinia stores here. This is useful for logging purposes later.
 */

export interface PiniaStores {
  basicStore: typeof useBasicStore
  // ... add other stores here
}
export const piniaStores: PiniaStores = {
  basicStore: useBasicStore,
  // ... add other stores here
}

export const usePiniaStores = (): { [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> } => {
  const entries = Object.entries(piniaStores)
  const stores: Partial<{ [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> }> = {}
  for (const [key, useStore] of entries)
    stores[key as keyof PiniaStores] = useStore()

  return stores as { [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> }
}
/**
 * Get the entire Pinia state
 * @returns Entire Pinia state
 */
export const getPiniaState = () => {
  const piniaStores = usePiniaStores()
  return Object.fromEntries(Object.entries(piniaStores).map(([key, store]) => [key, store.$state]))
}

