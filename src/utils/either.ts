type ExtractKeys<T> = T extends object ? keyof T : never
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type UnionKeys<T> = ExtractKeys<UnionToIntersection<T>>
type Key<T, K> = K extends keyof T ? T[K] : never

/**
 * @description Typesafe extract of the value from a union based on the key.
 * @example eitherProperty({ foo: 'foo' }, 'foo', 'bar') // returns 'foo'
 * @param obj The object to extract the value from
 * @param key1 The first key to check
 * @param key2 The second key to check
 */
export function eitherProperty<
  T extends object,
  K1 extends UnionKeys<T>,
  K2 extends UnionKeys<T>,
>(obj: T, key1: K1, key2: K2): Key<UnionToIntersection<T>, K1> | Key<UnionToIntersection<T>, K2> {
  if (key1 in obj) {
    const objAny: any = obj // requires any
    return objAny[key1]
  }
  else {
    const objAny: any = obj // requires any
    return objAny[key2]
  }
}
