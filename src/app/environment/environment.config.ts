import { getFeatureEnabled } from './urlFlagsHelper'

const getIsLocalHost = () => window.location.href.includes('localhost/') || window.location.href.includes('localhost:')
const BASE_PATH: string = import.meta.env.VITE_BASE_PATH || 'https://localhost'
const DOMAIN: string = import.meta.env.VITE_DOMAIN || 'localhost'
const APPLICATION_ID: string = import.meta.env.VITE_APPLICATION_ID || 'devApp1'
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || 'My App Title'
const APP_DESCRIPTION: string = import.meta.env.VITE_APP_DESCRIPTION || 'My App Description'

const CONTAINER_LOCATION = 'localhost/'
const VITE_LOCATION = 'localhost:'
const PAGES_DEV_PARAM = 'pages.dev' // ?pages.dev=true || &pages.dev

export const getApplicationId = () => `/${import.meta.env.VITE_APPLICATION_ID}/` || '/devApp1/'


const getIsContainer = () => window.location.href.toLowerCase().includes(CONTAINER_LOCATION)
const getIsPagesDev = () => getFeatureEnabled(PAGES_DEV_PARAM)
const getIsVite = () => getFeatureEnabled(VITE_LOCATION)
const getIsEmbedded = () => window.location !== window.parent.location

// eslint-disable-next-line node/prefer-global/process
const getIsNotClient = () => (typeof process !== 'undefined' && process?.versions?.node)
const getIsClient = () => !getIsNotClient()

const getEnvMode = () => {
  if (import.meta !== undefined && import.meta.env?.MODE) {
    return import.meta.env.MODE
  }
  if (getIsClient()) {
    // eslint-disable-next-line node/prefer-global/process
    return process.env.NODE_ENV
  }
  return undefined
}

const getIsDev = () => {
  const mode = getEnvMode()
  return ['development', 'dev', 'test'].includes(mode ?? '')
}

const getIsProd = () => !getIsDev()


export const env = {
  BASE_PATH,
  DOMAIN,
  APPLICATION_ID,
  getIsContainer,
  getIsLocalHost,
  getIsVite,
  getIsPagesDev,
  getIsEmbedded,
  getIsNotClient,
  getIsClient,
  APP_TITLE,
  APP_DESCRIPTION,
  getEnvMode,
  getIsDev,
  getIsProd,
  getApplicationId,
} as const

Object.entries(env).forEach(([key, value]) => {
  if (typeof value === 'function')
    console.log(key, value())
  else
    console.log(key, value)
})

export const BASE = env.APPLICATION_ID
