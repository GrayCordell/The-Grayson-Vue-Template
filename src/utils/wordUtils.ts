import { escapeRegex } from '~/utils/regexUtils'

export default {
  capitalize(word: string) {
    // s && s[0].toUpperCase() + s.slice(1)
    if (word)
      return word.charAt(0).toUpperCase() + word.slice(1)
    return word
  },

}

export const compareStringLowerCase = (a: string, b: string) => a?.toLowerCase?.() === b?.toLowerCase?.()

export const extractText = (page: string | null): string | null => {
  if ((page === null) || (page === ''))
    return null
  page = page.replace(/(<([^>]+)>)/ig, '')
  return page.replace(/<title>[^>]+<\/title>/g, '').replace(/<[^>]+>/g, '').replace(/\s\s+/g, ' ').trim()
}


export const pluralOrSingular
  = (count: number, item: { plural: string, name?: string, singular?: string }) =>
    count > 1
      ? item.plural
      : item?.singular || item.name


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
      .map(escapeRegex) // Escape special characters
      .join('|'),
    'g',
  )

  // Replace matched symbols/words with their ASCII equivalents
  return input.replace(regex, match => reverseSymbolMap[match])
}
