/* import { convertLatexToAsciiMath } from 'mathlive'
import { parseASCIIToLatex } from '~/utils/asciiToLatex'
import { replaceMathSymbolsWithAscii } from '~/utils/wordUtils'


interface Options { isWordProblem: boolean, skipLatexToAsciiAtStart: boolean }
export const asciiToLatexImproved = (content: string, options: Options = { isWordProblem: false, skipLatexToAsciiAtStart: false }) => {
  if (!content)
    return ''


  if (options.isWordProblem) {
    let text = content
    // text = text.replace(/\d+/g, match => ` \\ensuremath{\\frac{${match}}{2}} `) <-- How you can have special formatting inside text{} in MathJax
    // make all numbers bold
    text = text.replaceAll(/\d+/g, (match: string) => `\\(\\textbf{${match}}\\)`)
    return text
  }

  // const problemHasMultipleOperators = (content.match(/[+\-*\/]/g)?.length ?? 0) > 1
  // const problemHasDivision = content.includes('/')


  // Kind of dumb but we are going to convert the content to ascii and then back to latex to get the correct formatting
  let newContent = options.skipLatexToAsciiAtStart ? content : replaceMathSymbolsWithAscii(convertLatexToAsciiMath(content).trim())
  newContent = myFormatLatex(parseASCIIToLatex(newContent))
  return newContent
}
*/

// export function myFormatLatex(latex: string) {
//   // remove all spaces
//   latex = latex.replaceAll('\\,', '')
//   latex = latex.replaceAll('\\;', '')
//   latex = latex.replaceAll(' ', '')
//   console.log('newContentLatex', latex)
//   // Replace _ fraction division with \div if there is only one operator and it is division. I think this makes more sense.
//   // newContent = newContent.replace(/\\frac{(.+)}{(.+)}/g, '$1\\div $2}')

//   // replace all divs with fractions
//   latex = latex.replaceAll('\\div', '\\frac')

//   // Add thin spaces around \cdot, +, and - operators
//   latex = latex.replaceAll('\\cdot', '\\:\\cdot\\:')
//   latex = latex.replaceAll('\\div', '\\:\\div\\:')
//   latex = latex.replaceAll(/([+/\-])/g, '\\, $1 \\,')

//   // This is my attempt to fix the issue with the equal signs. I still don't think it fixes it all.
//   if (latex.includes('=')) {
//     // remove spaces around equal signs. remove , and ; around equal signs
//     latex = latex.replaceAll(/\s*=\s*/gim, '=')
//     latex = latex.replaceAll(/,=/gim, '=')
//     latex = latex.replaceAll(/;=/gim, '=')
//     latex = latex.replaceAll(/=,/gim, '=')
//     latex = latex.replaceAll(/=;/gim, '=')
//     // add thin space around equal signs
//     latex = latex.replaceAll('=', '\\,=\\,')
//   }

//   // newContent = newContent.replaceAll(/(=)/g, '\\:$1\\:')
//   latex = latex.replaceAll(' ', '')
//   latex = `\\(${latex}\\)`
//   return latex
// }

