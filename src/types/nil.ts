export const isNil = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined
export type Nil = undefined | null


/**
 * Filters out null & undefined values from an array.
 *
 * @param arr - An array that may contain null or undefined
 * @returns A new typed array with all null and undefined values removed.
 */
export function filterOutNil<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item !== undefined && item !== null)
}
