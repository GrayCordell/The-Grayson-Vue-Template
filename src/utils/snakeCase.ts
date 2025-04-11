/**
 * Converts a camelCase string to snake_case.
 * @param str - The camelCase string.
 * @returns The snake_case string.
 */
function toSnakeCase(str: string): string {
  return str.replaceAll(/([A-Z])/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Recursively converts an object's keys to snake_case.
 * @param obj - The object to convert.
 * @returns A new object with snake_case keys.
 */
function convertKeysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(element => convertKeysToSnakeCase(element))
  }
  else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const snakeKey = toSnakeCase(key)
      acc[snakeKey] = convertKeysToSnakeCase(obj[key])
      return acc
    }, {})
  }
  return obj
}

/**
 * Converts an object with camelCase keys to a JSON string with snake_case keys.
 * @param obj - The object to convert.
 * @param spaces - The number of spaces to use for indentation in the JSON string.
 * @returns A JSON string with snake_case keys.
 */
export function convertObjectToSnakeCaseJson(obj: object, spaces = 2): string {
  const snakeObj = convertKeysToSnakeCase(obj)

  function convertEscapedNewlines(text: string): string {
    return text.replaceAll('\\n', '\n')
  }

  return convertEscapedNewlines(JSON.stringify(snakeObj, null, spaces))
}
