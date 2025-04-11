/**
 * @fileoverview
 * This file is for any short hand aliases we want to create for existing types and type utilities.
 * Generally I would discourage this practice, but some types may be used frequently enough to warrant a shorthand alias.
 *
 */

/**
 * A shorthand alias for `Readonly<T>`, which makes an object immutable.
 * @example
 *  const obj: RO<{ name: string }> = { name: 'Alice' }
 * obj.name = 'Bob' // Error: Cannot assign to 'name' because it is a read-only property.
 * @see https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#readonly-properties
 */
export type RO<T> = Readonly<T>


/**
 * A shorthand alias for ReadonlyArray<T>, which makes an array immutable.
 * @example
 * const arr: ROArray<number> = [1, 2, 3]
 * arr[0] = 4 // Error: Index signature in type 'readonly number[]' only permits reading.
 * @see https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#readonly-properties
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#readonlyarray
 *
 */
export type ROArray<T> = ReadonlyArray<T>
