import { flags } from '~/app/environment/urlFlags'
import { i18n } from '~/app/setup/i18n'
import { capitalize } from '~/utils/capitalize'

export function makeTKey(text: string, condition = true): string {
  if (!condition)
    return text

  // TODO figure out why I have to use this many replace functions..

  // only take the first 7 words
  let newString = text.split(' ').slice(0, 7).join(' ')

  newString = newString.toLowerCase()

  // remove all punctuation
  newString = newString.replaceAll(/[!#$%&()*,./:;=^_`{}~\-]/g, '')

  // remove ' and "
  newString = newString.replaceAll(/["']/g, '')

  // remove ` and `
  newString = newString.replaceAll('`', '')

  // remove “
  newString = newString.replaceAll('“', '')

  // replace spaces with _
  newString = newString.replaceAll(' ', '_').toLowerCase()

  // make sure doesn't end with _
  if (newString.endsWith('_'))
    newString = newString.slice(0, -1)

  // make sure doesn't start with _
  if (newString.startsWith('_'))
    newString = newString.slice(1)

  return newString
}

export function unMakeTKeyExceptNamespaced(str: string): string {
  if (str.includes('.'))
    return str // will use t key if its namespaced

  let newString = str.replaceAll('_', ' ')
  newString = capitalize(newString)

  return newString
}

export function tKeyOnlyNamespaced(key: string, ogTKey: (key: string) => string): string {
  if (key.includes('.'))
    return ogTKey(key) // will not use t key if its namespaced

  return key
}

export function unMakeTKey(str: string) {
  let newString = str.replaceAll('_', ' ')
  newString = capitalize(newString)
  if (newString.includes('.')) // split
    newString = newString.split('.')[1]

  return newString
}

// t conditional. shorthand
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

// t custom. shorthand. Has to provide namespace through options for now for this one.
export function tc(tKey: string, args: Parameters<typeof i18n.global.t>[1] | null = null, options: {
  dontMakeTKey?: boolean
  namespace?: string
} = {}) {
  if (flags.getIsCustom()) {
    if (tKey?.includes('.'))
      tKey = tKey.split('.')[1]

    return tKey
  }
  else {
    let keyy = options.dontMakeTKey ? tKey : makeTKey(tKey)
    if (options?.namespace)
      keyy = `${options.namespace}.${keyy}`
    return args ? i18n.global.t(keyy, args) : i18n.global.t(keyy)
  }
}


// was previously used to search for t('key') in yaml conversation and replace with the translation t from i18n
export const replaceTranslationKeysForObject = (obj: any) => {
  const makeTranslationKeyFn = (value: string) => {
    const strippedValue = value.replace('t(', '').replaceAll(/[^\dA-Za-z\s-_]/g, '').replace(')', '')
    return `conversations.${makeTKey(strippedValue)}`
  }
  const isReplacablePropFn = (prop: string, value: string) => !['id', 'callback', 'nextId'].includes(prop) && !['mentor-agent', 'teachable-agent'].includes(value)
  console.log('replaceTranslationKeys')
  const stack = [obj]
  const { t } = i18n.global

  while (stack.length > 0) {
    const currentObj = stack.pop()

    for (const prop in currentObj) {
      const value = currentObj[prop]

      if (typeof value === 'object' && value !== null) {
        stack.push(value)
      }
      else if (typeof value === 'string' && isReplacablePropFn(prop, value)) {
        const translated = t(makeTranslationKeyFn(value))
        let usingTranslated = translated
        // if translation fails, use the original value. Console will log the missing translation
        if (translated.includes('conversations.'))
          usingTranslated = value

        currentObj[prop] = usingTranslated
      }
    }
  }
}
