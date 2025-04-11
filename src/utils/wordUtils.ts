import { escapeRegex } from '~/utils/regexUtils'
import { makeTKey } from '~/utils/translationUtils'

export const compareStringLowerCase = (a: string, b: string) => a?.toLowerCase?.() === b?.toLowerCase?.()

export const extractText = (page: string | null): string | null => {
  if ((page === null) || (page === ''))
    return null
  page = page.replaceAll(/(<([^>]+)>)/gi, '')
  return page.replaceAll(/<title>[^>]+<\/title>/g, '').replaceAll(/<[^>]+>/g, '').replaceAll(/\s\s+/g, ' ').trim()
}

export function pluralize(item: any, count:(null | undefined | number) = 1) {
  if (!item)
    return ''
  if (count === null || count === undefined)
    count = 1
  if (typeof item === 'string')
    return count > 1 ? `${item}s` : item
  if (typeof item === 'object') {
    const singular = item?.singularName || item?.singular || item?.name
    const plural = item?.pluralName || item?.plural || `${singular}s`
    return count > 1
      ? plural
      : singular
  }
  else {
    return ''
  }
}


// Also will replace english words with their ascii symbol equivalent
// DOES NOT INCLUDE x OR X
export function replaceMathSymbolsWithAscii(input: string): string {
  // Mapping of ASCII equivalents to arrays of symbols and words
  const symbolMap: { [key: string]: string[] } = {
    '+': ['+', '˖', '̟', '➕', '﹢', '⊕', '⨁', 'plus', 'addition', 'sum', 'add'],
    '-': ['-', '−', '⊖', '⨖', 'minus', 'subtraction', 'subtract', 'difference'],
    '*': ['*', '×', '·', '∗', '∗', '⨉', '⨯', 'multiply', 'times', 'product'],
    '/': ['/', '÷', '∕', '⫻', '⨸', 'divide', 'division', 'over'],
    '±': ['±', 'plus/minus', 'plus or minus'],
    '∓': ['∓', 'minus/plus', 'minus or plus'],
    '∪': ['∪', 'union'],
    '∩': ['∩', 'intersection'],
  }

  // Generate a reverse map for quick replacement lookup
  const reverseSymbolMap: { [key: string]: string } = {}
  for (const [ascii, symbols] of Object.entries(symbolMap)) {
    for (const symbol of symbols) {
      reverseSymbolMap[symbol] = ascii
    }
  }

  // Create a dynamic regex from the reverse map keys, escaping special characters
  const regex = new RegExp(
    Object.keys(reverseSymbolMap)
      .sort((a, b) => b.length - a.length) // Match longer symbols first for accuracy
      .map(element => escapeRegex(element)) // Escape special characters
      .join('|'),
    'g',
  )

  // Replace matched symbols/words with their ASCII equivalents
  return input.replace(regex, match => reverseSymbolMap[match])
}


/**
 *
 * @param wordOp 'addition', 'add', '+', 'subtraction', 'minus', '-', 'multiplication', 'times', 'multiply', '*', 'divide', 'division', '/'
 * @returns '+', '-', '*', '/'
 */
export function wordOpsToOps(wordOp: string): '+' | '-' | '*' | '/' | '^' | '(' | ')' | '' {
  switch (wordOp) {
    case 'addition': return '+'
    case 'add': return '+'
    case '+': return '+'

    case 'subtraction': return '-'
    case 'minus': return '-'
    case '-': return '-'

    case 'multiplication': return '*'
    case 'times': return '*'
    case 'multiply': return '*'
    case '*': return '*'

    case 'divide': return '/'
    case 'division': return '/'
    case '/': return '/'
    case 'parentheses': return '('
    case '(': return '('
    case ')': return ')'
    case 'powers': return '^'
    case '^': return '^'


    default:
      return ''
  }
}

const _capitalizeString = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
// kinda dumb, but it works
// produces a human string from an array of strings. It is also using t( )
export function listToHumanString(list: string[], { namespace = null, t, tCondition = true, separator = ', ', lastSeparator = ' and ', sur = '\'', capitalize = true }:
{ namespace?: string | null, t: any, tCondition?: boolean, separator?: string, lastSeparator?: string, sur?: string, capitalize?: boolean }) {
  if (t && tCondition) {
    if (namespace && namespace !== '')
      namespace += '.' // add dot if not empty
    else
      namespace = '' // empty string

    list = list.map((item) => {
      return t(`${namespace}${makeTKey(item, tCondition)}`)
    })
  }
  if (capitalize) // using vue capitalize filter
    list = list.map((item) => { return _capitalizeString(item) })

  if (sur)
    list = list.map((item) => { return `${sur}${item}${sur}` })

  let newString
  switch (list.length) {
    case 0:
      newString = ''
      break
    case 1:
      newString = list[0]
      break
    case 2:
      newString = `${list[0]} ${lastSeparator} ${list[1]}`
      break
    default: {
      // and on the last string
      const last = list.pop()
      list.push(`${lastSeparator} ${last}`)
      // make list a string / give optional separator
      return list.join(separator)
    }
  }
  return newString
}


export const getNumbersFromString = (str: string): number[] =>
  str.replaceAll(/\s+/g, '')
    .trim()
    .match(/\d+/g)
    ?.map(n => Number.parseInt(n, 10)) // Explicitly specify radix 10
    ?? []


// Some naive ordinal number generation
// for numbers greater than 15, it will just return the number with 'th' appended
export const ORDINAL_NUMBERS = [
  ['first', '1st'],
  ['second', '2nd'],
  ['third', '3rd'],
  ['fourth', '4th'],
  ['fifth', '5th'],
  ['sixth', '6th'],
  ['seventh', '7th'],
  ['eighth', '8th'],
  ['ninth', '9th'],
  ['tenth', '10th'],
  ['eleventh', '11th'],
  ['twelfth', '12th'],
  ['thirteenth', '13th'],
  ['fourteenth', '14th'],
  ['fifteenth', '15th'],
] as const
export const POSSIBLE_ORDINAL_NUMBERS = ORDINAL_NUMBERS.flatMap(([word, num]) => [word, num])
export const sloppyMakeOrdinal = (num: number): string =>
  num > 0 && num <= ORDINAL_NUMBERS.length
    ? ORDINAL_NUMBERS[num - 1][0]
    : `${num}th`

export const getOrdinalNumberForNumber = (num: number): string => ORDINAL_NUMBERS[num - 1]?.[0] || sloppyMakeOrdinal(num)

export function convertOrdinalToNumber(ordinal: string): number | null {
  // clean up by removing any spaces or punctuation
  ordinal = ordinal.replaceAll(/\s+/g, '').replaceAll(/[,.\-]/g, '')
  const index = ORDINAL_NUMBERS.findIndex(([word]) => word === ordinal)
  if (index === -1) {
    const match = ordinal.match(/\d+/) // Match the first sequence of digits
    return match ? Number.parseInt(match[0], 10) : null
  }
  return index + 1
}
