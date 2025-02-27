import { useDark } from '@vueuse/core'

interface Scheme {
  variables: {
    [key: string]: string
  }
}
interface Theme {
  condition: () => boolean
  lightScheme?: Scheme
  darkScheme?: Scheme
  theme?: Scheme
  isDefault?: boolean
}

interface AllThemes {
  [key: string]: Theme
}

// PLACE THEMES HERE. Nothing else needs to be done to add conditional themes.
// Default dark and light are set in index.pcss
const allThemes: AllThemes = {
  authColorScheme: {
    condition: () => false, // flags.getIsAuth(),
    theme: {
      variables: {
        '--accent': '#1e293b',
        '--accent-hover': '#4ade80',
        '--accent-darker': 'black',
      },
    },
  },
  kidsScheme: {
    condition: () => false, // flags.getIsKids(),
    theme: {
      variables: {
        '--accent': '#7EC8E3',
        '--accent-hover': '#6599cb',
        '--accent-darker': '#4a7a9b',
      },
    },
  },
  // (Defaults is in index.pcss)
  defaultScheme: {
    condition: () => true,
    isDefault: true,
    theme: {
      variables: {},
    },
  },
}

export const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})

export const setTheme = (colorSchemes: Theme) => {
  const darkSchemeVars
      = colorSchemes?.darkScheme?.variables
        || colorSchemes?.theme?.variables
        || colorSchemes?.lightScheme?.variables || {}
  const lightSchemeVars
      = colorSchemes?.lightScheme?.variables
        || colorSchemes?.theme?.variables
        || colorSchemes?.darkScheme?.variables || {}

  const usingSchemeVars = isDark?.value
    ? darkSchemeVars
    : lightSchemeVars

  Object.entries(usingSchemeVars).forEach(([key, value]) => {
    document.body.style.setProperty(key, value)
  })
}

export const initTheme = () => {
  const allNonDefaultThemes = Object.values(allThemes).filter(theme => !theme.isDefault)
  let foundTheme = false
  Object.values(allNonDefaultThemes).forEach((scheme) => {
    if (scheme.condition()) {
      setTheme(scheme)
      foundTheme = true
    }
  })
  if (!foundTheme) {
    setTheme(allThemes.defaultScheme)
  }
}
