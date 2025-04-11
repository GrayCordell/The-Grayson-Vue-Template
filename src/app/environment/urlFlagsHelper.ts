
import { useRoute } from 'vue-router'

// We suppress it because I can't use the router directly because the router itself needs to get the feature enabled from the window url. I haven't seen any issues with doing this yet.
const suppressVueWarning = (callback: () => any) => {
  const originalWarn = console.warn
  console.warn = (msg, ...args) => {
    if (msg.includes('inject() can only be used inside setup() or functional components')) {
      return
    }
    originalWarn(msg, ...args)
  }

  try {
    return callback()
  }
  finally {
    console.warn = originalWarn // Restore the original `console.warn`
  }
}


/**
 * Enhanced method to get feature flags using Vue Router's `useRoute`, with fallback to `oldGetFeatureEnabled`.
 */
export const getFeatureEnabled = (featureNameVariations_: string[] | string, routes?: string | string[]): boolean => {
  // Attempt to access `useRoute`, but check if it exists to avoid issues during initialization. Will fallback to using window.location if it doesn't exist.
  return suppressVueWarning(() => {
    const route = useRoute()
    const featureNameVariations = typeof featureNameVariations_ === 'string' ? [featureNameVariations_] : featureNameVariations_
    if (routes) {
      routes = typeof routes === 'string' ? [routes] : routes
      if (routes.some(route => window.location.href.includes(route)))
        return true
    }

    if (!route || route.fullPath === '/') {
      const urlParams = new URLSearchParams(window.location.search)
      return Array.from(urlParams.entries()).some(([key, value]) => routeEquals(key, featureNameVariations) && (value.toLowerCase() === 'true'))
    }

    const urlParams = new URLSearchParams(route.query as Record<string, string>)
    return Array.from(urlParams.entries()).some(([key, value]) => routeEquals(key, featureNameVariations) && (value.toLowerCase() === 'true'))
  })
}

function routeEquals(givenRoute_: string, allowedRouteNameVariations_: string[]) {
  const charsToRemove = ['-', '_', '.', ' ', ':', '(', ')', '#', '@', '!', '$', '%', '^', '&', '*', ';', '{', '}', '=', '+', '[', ']', '|', '?', '<', '>', '~', '`', '"']
  const removeCharsFn = (str: string, charArray: string[]) => {
    for (const char of charArray) {
      str = str.replaceAll(new RegExp(`\\${char}`, 'g'), '')
    }
    return str
  }

  const givenRoute = removeCharsFn(givenRoute_.toLowerCase().trim(), charsToRemove)
  const allowedRouteNameVariations = allowedRouteNameVariations_.map(route => removeCharsFn(route.toLowerCase().trim(), charsToRemove))
  // add s ending possibilities
  allowedRouteNameVariations.push(...allowedRouteNameVariations.map(name => `${name}s`))
  return allowedRouteNameVariations.some(name => givenRoute.includes(name))
}
