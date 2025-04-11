
export function veryCleanEquation(equationOrExpressionStr: string): string {
  const cleaned0 = equationOrExpressionStr.replaceAll(/\s/g, '')
  // Define the regex pattern to match number * variable
  const pattern = /(\d+)\s*\*\s*([a-z]+)/gi
  // Use the replace method with a callback to format the match
  let numberVariablizedString = cleaned0.replaceAll(pattern, (match, number, variable) => {
    return number + variable
  })
  // replace +- with -
  numberVariablizedString = numberVariablizedString.replaceAll('+-', '-')
  // replace *+ with *
  numberVariablizedString = numberVariablizedString.replaceAll('*+', '*')

  numberVariablizedString = numberVariablizedString.replaceAll('*', ' * ')
  numberVariablizedString = numberVariablizedString.replaceAll('+', ' + ')
  numberVariablizedString = numberVariablizedString.replaceAll('-', ' - ')
  return numberVariablizedString
}
