// noinspection PointlessBooleanExpressionJS,RedundantIfStatementJS

/**
 * Description: This file, urlFlags, contains all the URL flags and their associated logic.
 *
 * Example URL: https://localhost:6060/app1/causal-map?guest=true&someFlag=false
 */

import { env } from '~/app/environment/environment.config'

const getIsKids = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('kids') === 'true'
}

export const flags = {
  getIsKids,
  getUrlLanguageCodeOverride: () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('lang')
  },
  // add more flags as needed
}

// Prints all the flags and their values in development
if (env?.getIsLocalHost?.()) {
  Object.entries(env).forEach(([key, value]) => {
    if (typeof value === 'function')
      console.log(key, value())
    else
      console.log(key, value)
  })
}
