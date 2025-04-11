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
