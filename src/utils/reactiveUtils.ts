import { syncRefs } from '@vueuse/core'
import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Creates a new Ref object that is synchronized with the source ref. Can be updated independently, but if the source ref is updated, the target ref will revert to synchronizing with the source ref. See {@link https://vueuse.org/shared/syncRefs/ | syncRefs} for more information.
 * @param {Ref<T>} source - The source ref whose value to synchronize.
 * @returns {Ref<T>} A new Ref object that is synchronized with the source ref.
 */
export function useRefSync<T>(source: Ref<T>): Ref<T> {
  const target = ref<T>(source.value) as Ref<T>
  syncRefs(source, [target])
  return target
}
