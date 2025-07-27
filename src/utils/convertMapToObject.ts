export function convertMapToObject<T>(map: Map<string, T>): Record<string, T> {
  const obj: Record<string, T> = {}
  for (const [key, value] of map) {
    obj[key] = value
  }
  return obj
}


// recursive version for making all Map properties of an object converted to a object
export function convertMapPropertiesToObject<T>(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Map)
      newObj[key] = convertMapToObject(value)
    else if (typeof value === 'object' && value !== null)
      newObj[key] = convertMapPropertiesToObject(value)
    else
      newObj[key] = value
  }
  return newObj
}
