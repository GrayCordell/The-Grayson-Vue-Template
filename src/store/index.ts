import { useBasicStore } from '~/store/basicStore'

// interface PiniaStores {
//   mathMapStore: typeof useMathMapStore
//   bktStore: typeof useBKTStore
//   currentMathModuleStore: typeof useCurrentMathModuleStore
//   actionTrackerPluginStore: typeof useActionTrackerPluginStore
//   itemIconStore: typeof useItemDefinitionStore
// }
interface PiniaStores {
  basicStore: typeof useBasicStore
}
export const piniaStores: PiniaStores = {
  basicStore: useBasicStore,
}

export const usePiniaStores = (): { [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> } => {
  const entries = Object.entries(piniaStores)
  const stores: Partial<{ [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> }> = {}
  for (const [key, useStore] of entries)
    stores[key as keyof PiniaStores] = useStore()

  return stores as { [K in keyof PiniaStores]: ReturnType<PiniaStores[K]> }
}
export const getPiniaState = () => {
  const piniaStores = usePiniaStores()
  return Object.fromEntries(Object.entries(piniaStores).map(([key, store]) => [key, store.$state]))
}

