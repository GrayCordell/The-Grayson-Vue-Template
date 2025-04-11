
export const arrayEquals = <T>(a: T[], b: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b): boolean =>
  a.length === b.length && a.every((value, index) => isEqual(value, b[index]))

export function filterUniqueValues<T>(arr: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b): T[] {
  const uniqueArray: T[] = []
  const seen = new Map<T, boolean>()
  for (const current of arr) {
    let isUnique = true
    for (const key of seen.keys()) {
      if (isEqual(current, key)) {
        isUnique = false
        break
      }
    }
    if (isUnique) {
      uniqueArray.push(current)
      seen.set(current, true) // Store the value as a key in the Map
    }
  }
  return uniqueArray
}


const isSet = (value: any): value is Set<any> => value && value instanceof Set
const isMap = (value: any): value is Map<any, any> => value && value instanceof Map

/**
 * Check if a value is empty
 * @param value - The value to check
 */
export function thingIsEmpty(value: unknown): boolean {
  // Check for null or undefined
  if (!value || (Array.isArray(value) && value.length === 0))
    return true

  // Check for empty object
  if (typeof value === 'object')
    return Object.keys(value).length === 0 && value.constructor === Object

  // Check for empty Set or Map
  if (isSet(value) || isMap(value))
    return value.size === 0

  // Return false for all other types
  return false
  // console.log(isEmpty({})); // true
// console.log(isEmpty([])); // true
// console.log(isEmpty('')); // true
// console.log(isEmpty(new Set())); // true
// console.log(isEmpty(new Map())); // true
// console.log(isEmpty(0)); // false
// console.log(isEmpty(null)); // true
// console.log(isEmpty(undefined)); // true
}


export const stringIncludesOneOf = (str: string, arr: string[]) => {
  for (const item of arr) {
    if (str.includes(item))
      return true
  }
  return false
}


