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
const getIsPagesDev = () => window.location.href.toLowerCase().includes(PAGES_DEV_PARAM)
const getIsVite = () => window.location.href.toLowerCase().includes(VITE_LOCATION)
const getIsEmbedded = () => window.location !== window.parent.location
// @ts-expect-error ---
// eslint-disable-next-line node/prefer-global/process
const getIsNotClient = () => (typeof process !== 'undefined' && process?.versions?.node)
const getIsClient = () => !getIsNotClient()

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
} as const

Object.entries(env).forEach(([key, value]) => {
  if (typeof value === 'function')
    console.log(key, value())
  else
    console.log(key, value)
})

export const BASE = env.APPLICATION_ID
