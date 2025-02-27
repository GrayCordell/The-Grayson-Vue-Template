// import { parseASCIIToLatex } from '~/utils/asciiToLatex'
// import { convertLatexToAsciiMath } from 'mathlive'
// import { replaceMathSymbolsWithAscii } from '~/utils/wordUtils'


// interface Options { isWordProblem: boolean }
// // export const asciiToLatexImproved = (content: string, options: Options = { isWordProblem: false }) => {
// //   if (!content)
// //     return ''


// //   if (options.isWordProblem) {
// //     let text = content
// //     // text = text.replace(/\d+/g, match => ` \\ensuremath{\\frac{${match}}{2}} `) <-- How you can have special formatting inside text{} in MathJax
// //     // make all numbers bold
// //     text = text.replace(/\d+/g, (match: string) => `\\(\\textbf{${match}}\\)`)
// //     return text
// //   }

// //   // const problemHasMultipleOperators = (content.match(/[+\-*\/]/g)?.length ?? 0) > 1
// //   // const problemHasDivision = content.includes('/')


// //   // Kind of dumb but we are going to convert the content to ascii and then back to latex to get the correct formatting
// //   let newContent = replaceMathSymbolsWithAscii(convertLatexToAsciiMath(content).trim())

// //   newContent = parseASCIIToLatex(content)
// //   // remove all spaces
// //   newContent = newContent.replaceAll('\\,', '')
// //   newContent = newContent.replaceAll('\\;', '')
// //   newContent = newContent.replaceAll(' ', '')
// //   console.log('newContent', newContent)
// //   // Replace _ fraction division with \div if there is only one operator and it is division. I think this makes more sense.
// //   // newContent = newContent.replace(/\\frac{(.+)}{(.+)}/g, '$1\\div $2}')

// //   // replace all divs with fractions
// //   newContent = newContent.replaceAll(/\\div/g, '\\frac')

// //   // Add thin spaces around \cdot, +, and - operators
// //   newContent = newContent.replaceAll(/\\cdot/g, '\\:\\cdot\\:')
// //   newContent = newContent.replaceAll(/\\div/g, '\\:\\div\\:')
// //   newContent = newContent.replaceAll(/([+\-\/])/g, '\\, $1 \\,')

// //   // This is my attempt to fix the issue with the equal signs. I still don't think it fixes it all.
// //   if (newContent.includes('=')) {
// //     // remove spaces around equal signs. remove , and ; around equal signs
// //     newContent = newContent.replaceAll(/\s*=\s*/gmi, '=')
// //     newContent = newContent.replaceAll(/,=/gmi, '=')
// //     newContent = newContent.replaceAll(/;=/gmi, '=')
// //     newContent = newContent.replaceAll(/=,/gmi, '=')
// //     newContent = newContent.replaceAll(/=;/gmi, '=')
// //     // add thin space around equal signs
// //     newContent = newContent.replaceAll(/=/g, '\\,=\\,')
// //   }

// //   // newContent = newContent.replaceAll(/(=)/g, '\\:$1\\:')
// //   newContent = newContent.replaceAll(' ', '')
// //   newContent = `\\(${newContent}\\)`
// //   return newContent
// // }
