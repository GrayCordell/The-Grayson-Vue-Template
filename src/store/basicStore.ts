import { defineStore } from 'pinia'

interface BasicStoreState {
  someState: string
  someNumber: number
}

// Services should likely be placed somewhere else.
// eslint-disable-next-line no-unused-vars
function getDoubleOfSomeNumber(someNumber: number): number {
  return someNumber * 2
}


/**
 * Generally I encourage stores to just be simple getters and setters. Calculated values should likely be functions placed in a service.
 */
export const useBasicStore = defineStore('basicStore', {
  state: (): BasicStoreState => ({
    someState: 'someValue',
    someNumber: 0,
  }),
  getters: {
    getSomeState: state => () => state.someState,
    // No getDoubleOfSomeNumber getter, A function can be used elsewhere. If its very specific computed value you can attach a service to it.
    // getDoubleOfSomeNumber: state => () => getDoubleOfSomeNumber(state.someNumber), <-- If you have to have a computed getter use this pattern
  },
  actions: {
    setSomeState(value: string) { this.someState = value },
    setSomeNumber(value: number) { this.someNumber = value },
  },
})
