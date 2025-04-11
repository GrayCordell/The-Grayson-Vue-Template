import { env } from '~/app/environment/environment.config.ts'

function createDeepMonitor<T extends object>(obj: T, label = 'monitored', path = ''): T {
  if (typeof obj !== 'object' || obj === null)
    return obj

  return new Proxy(obj, {
    get(target, prop, receiver) {
      const fullPath = `${path}${String(prop)}`
      const value = Reflect.get(target, prop, receiver)

      console.debug(`[${label}] Read access: '${fullPath}'`)

      if (typeof value === 'object' && value !== null) {
        return createDeepMonitor(value, label, `${fullPath}.`)
      }

      return value
    },
    set(target, prop, value, receiver) {
      const fullPath = `${path}${String(prop)}`
      console.warn(`[${label}] Mutation detected: setting '${fullPath}' to`, value)
      return Reflect.set(target, prop, value, receiver)
    },
    deleteProperty(target, prop) {
      const fullPath = `${path}${String(prop)}`
      console.warn(`[${label}] Mutation detected: deleting property '${fullPath}'`)
      return Reflect.deleteProperty(target, prop)
    },
    defineProperty(target, prop, descriptor) {
      const fullPath = `${path}${String(prop)}`
      console.warn(`[${label}] Mutation detected: redefining property '${fullPath}'`)
      return Reflect.defineProperty(target, prop, descriptor)
    },
  })
}

/**
 * Description: This function is used to monitor mutations on an object only in development mode.
 * will cause performance issues, but only in development mode.
 * @param obj - The object to monitor. (will console log all mutations)
 * @param label
 */
export function devMonitorMutations<T extends object>(obj: T, label = 'monitored'): T {
  if (env.getIsDev())
    return createDeepMonitor(obj, label)
  return obj //  if not in dev mode, return the original object
}
