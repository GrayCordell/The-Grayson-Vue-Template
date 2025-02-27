/**
 * Description: This is the i18n setup file, We use vue-i18n all over for translations.
 * Notes:
 */
import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { flags } from '~/app/environment/urlFlags'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
export const i18n = createI18n({
  legacy: false,
  locale: '',
  // fallbackLocale: 'en', TODO find why this is not working
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../../locales/*.yml'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}
export async function i18nSetup() {
  const STARTING_LOCALE = flags.getUrlLanguageCodeOverride() || navigator?.language || 'en'
  await loadLanguageAsync(STARTING_LOCALE)
}
const tryGetClosestLangCode = (langCode: string) => {
  const langCodes = Object.keys(localesMap)
  const foundEntireCode = langCodes.find(code => code.startsWith(langCode))
  if (foundEntireCode) {
    return foundEntireCode
  }
  else {
    /*  TODO not great in the case of 'foo-bar' & 'foo-baz' both being available it will just pick the first one.
       I don't know enough about language codes to know if this is a problem when/if we have a ton of languages */
    const firstCode = langCode.split('-')[0]
    const foundFirstCode = langCodes.find(code => code.startsWith(firstCode))
    if (foundFirstCode)
      return foundFirstCode
    else
      return null
  }
}
let count = 0
export async function loadLanguageAsync(lang: string): Promise<Locale> {
  let foundLangCode: string | null = flags.getUrlLanguageCodeOverride() || tryGetClosestLangCode(lang) // en-US -> en or pt -> pt-BR (whatever language we have that is closest to their desired language)

  // changed locales manually, then lets just use that (clicked language button or its set in the url params)
  if (count === 0)
    foundLangCode = flags.getUrlLanguageCodeOverride() || localStorage.getItem('locale') || foundLangCode
  count++
  if (!foundLangCode)
    foundLangCode = 'en'

  // If the language is already downloaded then just set it
  if (i18n.global.locale.value === foundLangCode || loadedLanguages.includes(foundLangCode))
    return setI18nLanguage(foundLangCode)

  // If the language hasn't been downloaded yet
  const messages = await localesMap?.[foundLangCode]?.() || { default: {} }
  i18n.global.setLocaleMessage(foundLangCode, messages.default)
  loadedLanguages.push(foundLangCode)
  return setI18nLanguage(foundLangCode)
}


// t conditional
export function tCond(tKey: string, condition: boolean, args: (object | null) = null) {
  if (condition) {
    // @ts-expect-error ---
    return i18n.global.t(tKey, args)
  }
  else {
    if (tKey?.includes('.'))
      tKey = tKey.split('.')[1]

    return tKey
  }
}
