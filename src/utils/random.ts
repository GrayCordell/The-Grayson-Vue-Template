/* eslint-disable jsdoc/check-param-names */

interface RandomIntArgs {
  min?: number
  max?: number
  rng?: () => number
}

/**
 * Min & Max are optional. If no argument is provided, it will return a random number between 0 and 10000000.
 * Returns a random int between min and max (inclusive)
 *
 * @param min
 * @param max
 * @param rng - Random number generator function, Can use mulberry32 for deterministic random numbers
 */
export const randomInt = ({ min = 0, max = 10000000, rng = Math.random }: RandomIntArgs): number => {
  if (min > max)
    [min, max] = [max, min]
  return Math.floor(rng() * (max - min + 1)) + min
}

/**
 * Returns a random element from the provided array
 *
 * @param arr - Array to get random element from
 * @param rng - Random number generator function, Can use mulberry32 for deterministic random numbers
 */
export const getRandomFrom = <T>(arr: readonly T[], rng = Math.random): T => {
  const index = randomInt({ min: 0, max: arr.length - 1, rng })
  return arr[index]
}

/**
 * Mulberry32 PRNG
 * Makes a deterministic random number generator. (Same seed will always produce the same sequence of random numbers)
 * @param seed
 */
export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}


/**
 * Mulberry32 PRNG with persistence
 * Makes a deterministic random number generator that persists the seed in localStorage.
 * @param initialSeed - Initial seed value, defaults to 1
 * TODO will possibly cause issues when users swap computers as that's not being saved in a store/online yet.
 */
export function persistentMulberry32(saveName: string = 'defaultSave', initialSeed: number = 1): () => number {
  // First, try to get a stored seed from localStorage
  const storedSeed = localStorage.getItem(`prngSeed_${saveName}`)
  let seed = storedSeed !== null ? Number(storedSeed) : initialSeed

  return function () {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    // Save the updated seed to localStorage for persistence
    localStorage.setItem(`prngSeed_${saveName}`, seed.toString())
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Example usage:
// const rng = mulberry32(4)
// const randomNum = () => randomInt({ min: 0, max: 100, rng })
// console.log(randomNum())
// console.log(randomNum())
// console.log(randomNum())
//
// const tmp = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
// console.log(getRandomFrom(tmp, rng))
// console.log(getRandomFrom(tmp, rng))
// console.log(getRandomFrom(tmp, rng))
// console.log(getRandomFrom(tmp, rng))
// console.log(getRandomFrom(tmp, rng))
