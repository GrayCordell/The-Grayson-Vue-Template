
export const NAMES = ['Sally', 'John', 'Mary', 'Tom', 'Alice', 'Bob', 'Jill', 'Jack', 'Sue', 'Joe']
export interface ItemGenItem {
  icon: any
  type: string
  name: string
  plural: string
  properties?: {
    isFood?: boolean
    // color?: string
  }
}
