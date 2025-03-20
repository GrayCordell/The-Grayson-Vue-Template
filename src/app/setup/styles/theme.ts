import { useDark } from '@vueuse/core'
import { flags } from '~/app/environment/urlFlags'

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
  mathKidsScheme: {
    condition: () => flags.getIsKids(),
    theme: {
      variables: {
        '--accent': '#7EC8E3',
        '--accent-hover': '#6599cb',
        '--betty': '#d0e6d6',
        '--mentor': '#6AAFAE',
        '--accent-darker': 'black',
        '--canvas-background-color': '#fafafa',
        '--canvas-pattern-color': '#f2f2f2',
        '--agent-border-1': ' ',
        '--agent-border-2': ' ',
        '--conversation-divider-color': '#dcdcdc',
        '--message-text-color': '#333333',
        '--message-text-shadow': 'none',
        '--agent-start-background-color': '#f2f2f2',
        '--conversation-pane-background-color': '#f2f2f2',
        '--show-hide-button-color': '#f9a03f',
        '--agent-picture-box-icon-color': '#f9a03f',
        '--agent-picture-box-text-color': '#333333',
        '--message-data-text-color': '#969696',
        '--message-data-text-shadow': 'none',

        // Drag and Drop
        // Colors
        '--dnd-color-number': '#d32f2f',
        '--dnd-color-primary-dark': '#2a2a2a',
        '--dnd-color-white': '#ffffff',

        // Background Colors
        '--dnd-bg-secondary': '#e1f5fe',
        '--dnd-bg-special': '#7ec8e3',
        '--dnd-bg-input': '#b0d3e6',
        '--dnd-bg-tertiary': '#b3e5fc',
        '--dnd-bg-highlight': '#b3e5fc',

        // Border Colors
        '--dnd-border-secondary': '#2196f3',
        '--dnd-border-input': '#1976d2',
        '--dnd-border-tool-box': 'rgb(40, 158, 201)',
        '--dnd-border-work-area': '#7ec8e3',
        '--dnd-border-chat': '#406ebd59',
        '--dnd-border-drop-zone': '#2196f3',

        // Shadow Colors
        '--dnd-shadow-work-area': 'rgba(126, 200, 227, 1)',
        '--dnd-shadow-default': 'rgba(0, 0, 0, 0.2)',
        '--dnd-shadow-light': 'rgba(0, 0, 0, 0.1)',
        // Drag and Drop area. (Some are actually only for default drop zone that is not override)
        '--dnd-default-drop-zone-border': '#289ec9',
        '--dnd-default-drop-zone-background': '#7ec8e3',
        '--dnd-default-drop-zone-highlight': '#a2d1ec',
        '--dnd-default-drop-zone-highlight-border': '#6baed6',
        '--dnd-default-drop-zone-text-color': 'var(--primary)',
        '--dnd-zone-default-highlight-shadow': 'rgba(65, 110, 189, 0.3)',
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
