/**
 * Description: random functions undeserving of there own file.
 * Notes: TODO A lot of these should probably be moved to a service...
 */
import { env } from '~/app/environment/environment.config'

export const deepCopy = (value: unknown) => JSON.parse(JSON.stringify(value))

export function rgb(r: number, g: number, b: number): string {
  return `rgb(${r},${g},${b})`
}
export function keyInMap(map: any, key: string): boolean {
  const keys = [...map.keys()]
  return keys.includes(key)
}
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function makeTKey(text: string, condition = true): string {
  if (!condition)
    return text

  // TODO figure out why I have to use this many replace functions..

  // only take the first 7 words
  let newString = text.split(' ').slice(0, 7).join(' ')

  newString = newString.toLowerCase()

  // remove all punctuation
  newString = newString.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')

  // remove ' and "
  newString = newString.replace(/['"]/g, '')

  // remove ` and `
  newString = newString.replace(/`/g, '')

  // remove “
  newString = newString.replace(/“/g, '')

  // replace spaces with _
  newString = newString.replace(/ /g, '_').toLowerCase()

  // make sure doesn't end with _
  if (newString.endsWith('_'))
    newString = newString.slice(0, -1)

  // make sure doesn't start with _
  if (newString.startsWith('_'))
    newString = newString.slice(1)

  return newString
}
export function unMakeTKeyExceptNamespaced(str: string): string {
  if (str.includes('.'))
    return str // will use t key if its namespaced

  let newString = str.replace(/_/g, ' ')
  newString = capitalize(newString)

  return newString
}
export function tKeyOnlyNamespaced(key: string, ogTKey: (key: string) => string): string {
  if (key.includes('.'))
    return ogTKey(key) // will not use t key if its namespaced

  return key
}
export function unMakeTKey(str: string) {
  let newString = str.replace(/_/g, ' ')
  newString = capitalize(newString)
  if (newString.includes('.')) // split
    newString = newString.split('.')[1]

  return newString
}

function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash)

  return hash
}

function hsvToRgb(h: number, s: number, v: number): number[] {
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  return [
    Math.floor(f(5) * 255),
    Math.floor(f(3) * 255),
    Math.floor(f(1) * 255),
  ]
}

export function stringToColor(str: string): string | undefined {
  if (!str)
    return undefined

  const hash = hashString(str)
  const hue = hash % 360 // Ensure hue is [0, 360)
  const rgb = hsvToRgb(hue, 0.5, 0.95) // Saturation = 0.5, Value = 0.95 for vibrant colors

  return `#${rgb.map(value => (`00${value.toString(16)}`).slice(-2)).join('')}`
}

export function isEmpty(value: any): boolean {
  // Check for null or undefined
  if (value === null || value === undefined)
    return true

  // Check for empty string
  if (typeof value === 'string')
    return value === ''

  // Check for empty array
  if (Array.isArray(value))
    return value.length === 0

  // Check for empty object
  if (typeof value === 'object')
    return Object.keys(value).length === 0 && value.constructor === Object

  // Check for empty Set or Map
  if (value instanceof Set || value instanceof Map)
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

export function mapObject(obj: any, callback: (key: string, value: any, index: number) => [string, any]) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value], index) => callback(key, value, index)),
  )
  // const result = mapObject({ a: 1, b: 2, c: 3 }, (key, value) => [key + 'X', value * 10]);
  // console.log(result); // { aX: 10, bX: 20, cX: 30 }
}
export const includesOneOf = (str: string, arr: string[]) => {
  for (const item of arr) {
    if (str.includes(item))
      return true
  }
  return false
}

export function extractModuleNameFromUrl(url: string, appId = env.APPLICATION_ID): string | null {
  const pattern = new RegExp(`/${appId}/([^/&]+)(/|&)`) // match anything between /bb/ and / or & so bb/thermoregulation/ or bb/thermoregulation&guest === thermoregulation
  const match = url.match(pattern)
  if (match)
    return match[1]
  else
    return null // or throw an error, depending on how you want to handle the absence of moduleId
}

/**
 *
 * @param str {string | null | undefined}
 * @returns {boolean} true if the string is a url
 */
export const isBlobStringAUrl = (str: string): boolean =>
  str?.startsWith?.('blob:http://') || str?.startsWith?.('blob:https://') || false

export const decodeBase64ToBlob = (base64String: string): Blob => {
  const binaryData = atob(base64String)
  const arrayBuffer = new ArrayBuffer(binaryData.length)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryData.length; i++)
    view[i] = binaryData.charCodeAt(i)

  return new Blob([arrayBuffer], { type: 'audio/mp3' })
}
export function convertStudentUrlToTeacher(teacherId: string, studentUrl: string): string {
  console.log('convertStudentUrlToTeacher')
  let teacherUrl = studentUrl.replace('studentId=', 'getStudentId=')
  teacherUrl = `${teacherUrl}&teacherId=${teacherId}`
  return teacherUrl
}
export class SeededRandom {
  seed: number
  constructor(seed: number) {
    this.seed = seed
  }

  random() {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }
}
export const calcHash = (str: string): number => {
  let hash = 0
  let i
  let chr
  let len
  if (str.length === 0)
    return hash
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
export const RANDOM_COLORS_1 = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b']
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

export function findNumbersWithRandomSum(min: number, max: number, count: number): number[] {
  if (count < 1)
    throw new Error('Count must be at least 1')
  if (min < 0)
    throw new Error('Minimum value must be non-negative')
  if (max < min)
    throw new Error('Maximum value must be greater than or equal to minimum value')
  // Generate a random target sum within the specified range
  const targetSum = getRandomInt(min, max)
  // console.log('targetSum', targetSum)

  const numbers: number[] = []
  // Randomly distribute the remaining sum across the numbers
  let whatsLeft = targetSum
  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      numbers[i] = whatsLeft
      break
    }
    // console.log('whatsLeft', whatsLeft)
    const newNumber = getRandomInt(0, whatsLeft + 1)
    numbers[i] = newNumber
    whatsLeft -= newNumber
  }

  // console.log('end', numbers)
  return numbers
}

/**
 * Executes the provided function immediately and returns its result.
 *
 * This utility function is useful for encapsulating and immediately
 * invoking initialization logic or computations. It improves code
 * readability and ensures that the function's intent is clear.
 *
 * @template T - The return type of the function being executed.
 * @param {() => T} fn - The function to execute immediately.
 * @returns {T} The result of the executed function.
 *
 * @example
 * // Example usage in a Vue 3 component
 * import { ref, computed } from 'vue';
 * import { executeNow } from './executeNow';
 *
 * const complexLogic = executeNow(() => {
 *   const x = ref(10);
 *   const y = computed(() => 3 + x.value);
 *   return computed(() => y.value + 1);
 * });
 *
 * console.log(complexLogic.value); // Outputs 14
 */
export function executeNow<T>(fn: () => T): T {
  return fn()
}

export const arrayEquals = <T>(a: T[], b: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b): boolean =>
  a.length === b.length && a.every((value, index) => isEqual(value, b[index]))

// Convert a boolean to 0 or 1
type ZeroOrOne = 0 | 1
export function convertBoolean(input: boolean): (ZeroOrOne)
export function convertBoolean(input: (boolean | ZeroOrOne)[]): ZeroOrOne[]
export function convertBoolean(input: boolean | (boolean | ZeroOrOne)[]): ZeroOrOne | ZeroOrOne[] {
  if (typeof input === 'boolean') {
    return input ? 1 : 0
  }
  else if (Array.isArray(input)) {
    // Convert an array, handle boolean, 0, and 1 appropriately
    return input.map((item) => {
      if (typeof item === 'boolean') {
        return item ? 1 : 0
      }
      return item
    })
  }
  return input
}

export function filterUniqueValues<T>(arr: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b): T[] {
  const uniqueArray: T[] = []
  const seen = new Map<T, boolean>()
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
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


interface Point {
  x: number
  y: number
}

/**
 * @param items - The items to search through
 * @param target - The target location to find the closest item to
 * @param getCoordinates - A function that returns the coordinates of an item. eg. (item)=> item.position or (item)=> item
 */
export function findClosest<T>(
  items: T[],
  target: Point,
  getCoordinates: (item: T) => Point,
): T | null {
  if (items.length === 0)
    return null

  return items.reduce((closest, current) => {
    const currentCoords = getCoordinates(current)
    const closestCoords = getCoordinates(closest)

    const distanceToCurrent = Math.sqrt(
      (currentCoords.x - target.x) ** 2
      + (currentCoords.y - target.y) ** 2,
    )
    const distanceToClosest = Math.sqrt(
      (closestCoords.x - target.x) ** 2
      + (closestCoords.y - target.y) ** 2,
    )

    return distanceToCurrent < distanceToClosest ? current : closest
  })
}
