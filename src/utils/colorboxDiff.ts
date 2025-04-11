// import { diffWordsWithSpace } from 'diff'
// import { asciiToLatexImproved } from '~/utils/asciiToLatexImproved'
// import { escapeRegex } from '~/utils/regexUtils'

// /**
//  * Compare two ASCII-math strings, highlight their differences by embedding
//  * `colorbox green ...` or `colorbox red ...` in the ASCII, then parse that
//  * highlighted ASCII to final LaTeX with \colorbox commands.
//  */
// export function colorboxDiff(
//   asciiOriginal: string,
//   asciiModified: string,
//   options: { highlightAdded: boolean, highlightRemoved: boolean } = { highlightAdded: true, highlightRemoved: true },
// ): string {
//   console.log('asciiOriginal', asciiOriginal)
//   console.log('asciiModified', asciiModified)
//   const notAllowedSymbols = ['\\', '{', '}', '[', ']', '|', '_', '!', '?', '&', '~']
//   const regex = new RegExp(notAllowedSymbols.map(element => escapeRegex(element)).join('|'), 'gmi')

//   const cleanFn = (str: string) => str
//     .replaceAll(/[\t\n\r]/gim, ' ') // remove newlines and tabs
//     .replace(regex, '') // remove not allowed symbols
//     .replaceAll('left', '') // remove left (should not happen)
//     .replaceAll('right', '') // remove right  (should not happen)
//     .replaceAll(/\+\s*-/gim, '-') // replace + - with -
//     .replaceAll(/-\s*\+/gim, '-') // replace - + with -
//     .replaceAll(/\+\s*\+/gim, '+') // replace + + with +
//     .replaceAll(/\s+/gim, '') // remove all spaces
//     .replaceAll('=', ' = ') // add spaces around equal signs
//     .replaceAll('/', ' / ') // add spaces around division signs
//     .replaceAll('*', ' * ') // add spaces around multiplication signs
//     .replaceAll('+', ' + ') // add spaces around addition signs
//     .replaceAll('-', ' - ') // add spaces around subtraction signs
//     .replaceAll('(', ' ( ') // add spaces around opening parentheses
//     .replaceAll(')', ' ) ') // add spaces around closing parentheses
//     .replaceAll('^', ' ^ ') // add spaces around exponentiation signs
//     .replaceAll(/\s+/gim, ' ') // remove all spaces
//     .trim() // remove leading and trailing spaces


//   // Fix some common issues with the math ASCII that is maybe causing issues
//   asciiOriginal = cleanFn(asciiOriginal)
//   asciiModified = cleanFn(asciiModified)
//   console.log('asciiOriginal-cleaned', asciiOriginal)
//   console.log('asciiModified-cleaned', asciiModified)


//   // 1. Diff the ASCII
//   const diffParts = diffWordsWithSpace(asciiOriginal, asciiModified, { ignoreWhitespace: false, ignoreCase: true })


//   // 2. Insert colorbox markers
//   const asciiWithColorboxes = diffParts
//     .map((part) => {
//       if (!part.value) // I think this is impossible
//         return ''

//       if (part.added) {
//         if (!options.highlightAdded) // No added highlighting
//           return ''
//         if (part.value.includes('(') || part.value.includes(')')) // ignore parentheses for now
//           return part.value
//         // highlight rest
//         return `color {green}{${part.value}}`
//       }
//       else if (part.removed) {
//         if (!options.highlightRemoved)
//           return ''
//         if (part.value.includes('(') || part.value.includes(')')) // ignore parentheses for now
//           return part.value
//         // highlight rest
//         return `color {red}{${part.value}}`
//       }
//       else {
//         return part.value // unchanged
//       }
//     })
//     .join('')
//   // 3. Now parse that final annotated ASCII into LaTeX
//   console.log('asciiWithColorboxes', asciiWithColorboxes)

//   const asciiToLatexDiff = asciiToLatexImproved(asciiWithColorboxes, { isWordProblem: false, skipLatexToAsciiAtStart: true }) // LatexToAscii doesn't currently handle colorboxes, so we need to skip doing it.
//   console.log('asciiToLatexDiff', asciiToLatexDiff)
//   return asciiToLatexDiff
// }
