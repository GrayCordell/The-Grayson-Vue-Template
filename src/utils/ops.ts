
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
