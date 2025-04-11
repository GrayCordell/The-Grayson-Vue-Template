/**
 * Description: random functions undeserving of there own file.
 * Notes: TODO A lot of these should probably be moved to a service...
 */
import { env } from '~/app/environment/environment.config'


export function extractModuleNameFromUrl(url: string, appId = env.APPLICATION_ID): string | null {
  const pattern = new RegExp(`/${appId}/([^/&]+)(/|&)`) // match anything between /bb/ and / or & so bb/thermoregulation/ or bb/thermoregulation&guest === thermoregulation
  const match = url.match(pattern)
  return match ? match[1] : null
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

/**
 * @param items - The items to search through
 * @param target - The target location to find the closest item to
 * @param target.x - The x coordinate of the item
 * @param target.y - The y coordinate of the item
 * @param getCoordinates - A function that returns the coordinates of an item. eg. (item)=> item.position or (item)=> item
 */
export function findClosest<T>(
  items: T[],
  target: {
    x: number
    y: number
  },
  getCoordinates: (item: T) => {
    x: number
    y: number
  },
): T | null {
  if (items.length === 0)
    return null

  return items.reduce((closest, current) => {
    const currentCoords = getCoordinates(current)
    const closestCoords = getCoordinates(closest)

    const distanceToCurrent = Math.hypot(
      (currentCoords.x - target.x),
      (currentCoords.y - target.y),
    )
    const distanceToClosest = Math.hypot(
      (closestCoords.x - target.x),
      (closestCoords.y - target.y),
    )

    return distanceToCurrent < distanceToClosest ? current : closest
  })
}


/**
 * Safely checks if a property exists on any input.
 *
 * @param obj - The value to check.
 * @param prop - The property key to look for.
 * @returns True if `prop` exists on `obj` (including via the prototype chain); otherwise, false.
 */
export function hasProperty(
  obj: unknown,
  prop: PropertyKey,
): obj is Record<PropertyKey, unknown> {
  return (
    obj !== null
    && (typeof obj === 'object' || typeof obj === 'function')
    && prop in new Object(obj)
  )
}
/**
 * Safely checks if a property exists on any input. (Also asserts the type of `obj` as being the type with the property)
 *
 * @param obj - The value to check.
 * @param prop - The property key to look for.
 * @returns True if `prop` exists on `obj` (including via the prototype chain); otherwise, false.
 */
function hasPropertyV2<T, K extends PropertyKey>(
  obj: T,
  prop: K,
): obj is T & Record<K, unknown> {
  return (
    obj !== null
    && (typeof obj === 'object' || typeof obj === 'function')
    && prop in new Object(obj)
  )
}
