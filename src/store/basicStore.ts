import { defineStore } from 'pinia'

interface State {
  someState: string
}
export const useBasicStore = defineStore('basicStore', {
  state: (): State => ({
    someState: 'someValue',
  }),
  getters: {
    getBktScoreForGroup: state => () => state.someState,
  },
  actions: {
    setSomeState(value: string) {
      this.someState = value
    },
  },
})
