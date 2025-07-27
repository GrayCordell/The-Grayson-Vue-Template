// dsl-parser.ts

type MetaValue = string | number | boolean
type Meta = Record<string, MetaValue>

type FeatureDef =
  | { type: 'simple', feature: string, meta: Meta }
  | { type: 'group', logic: 'or' | 'and', children: FeatureDef[], weights: number[] }

interface Room {
  name?: string
  theme?: string
  difficulty?: number
  metadata: Meta
  variables: Record<string, FeatureDef>
  layout: FeatureDef[][]
}

interface DSLResult {
  global: {
    variables: Record<string, FeatureDef>
  }
  rooms: Room[]
}

const DIRECTIONAL_SYMBOLS = new Set(['^', 'v', '<', '>'])

function parseMetadata(tokens: string[]): Meta {
  const meta: Meta = {}
  for (const token of tokens) {
    if (!token.startsWith('@'))
      continue

    const [key, value] = token.slice(1).split('=')
    if (value === undefined) {
      meta[key] = true
    }
    else {
      // Try to parse as number or boolean
      if (/^-?\d+$/.test(value))
        meta[key] = Number.parseInt(value, 10)
      else if (value.toLowerCase() === 'true')
        meta[key] = true
      else if (value.toLowerCase() === 'false')
        meta[key] = false
      else meta[key] = value
    }
  }
  return meta
}

function parseFeatureExpression(expr: string): FeatureDef {
  expr = expr.trim()
  if (!expr)
    throw new Error('Empty expression')

  // Handle simple features
  if (!expr.startsWith('(')) {
    const tokens = expr.split(/\s+/)
    const feature = tokens[0]
    const metaTokens = tokens.slice(1).filter(t => t.startsWith('@'))
    return {
      type: 'simple',
      feature,
      meta: parseMetadata(metaTokens),
    }
  }

  // Handle groups
  if (!expr.endsWith(')')) {
    throw new Error(`Unterminated group: ${expr}`)
  }

  const inner = expr.slice(1, -1).trim()
  if (!inner)
    throw new Error('Empty group')

  // Split while respecting parentheses
  const tokens: string[] = []
  let current = ''
  let depth = 0

  for (const char of inner) {
    if (char === '(') {
      depth++
      current += char
    }
    else if (char === ')') {
      depth--
      current += char
    }
    else if (char === ' ' && depth === 0) {
      if (current)
        tokens.push(current)
      current = ''
    }
    else {
      current += char
    }
  }
  if (current)
    tokens.push(current)

  // Find operator with minimal depth
  let operatorIndex = -1
  let operator: 'or' | 'and' | null = null
  let weights: number[] = []
  let lastToken = ''

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token === '_or_') {
      operator = 'or'
      operatorIndex = i
      weights = [50, 50] // Default weights
      break
    }
    else if (token === '_and_') {
      operator = 'and'
      operatorIndex = i
      weights = [100, 100] // Default weights
      break
    }
    else if (token.endsWith('%_or_')) {
      operator = 'or'
      operatorIndex = i
      const weight = Number.parseFloat(token)
      weights = [weight, 100 - weight]
      break
    }
    else if (token.startsWith('_or_') && token.endsWith('%')) {
      operator = 'or'
      operatorIndex = i
      const weight = Number.parseFloat(token.slice(4))
      weights = [100 - weight, weight]
      break
    }
    else if (token.startsWith('_and_') && token.endsWith('%')) {
      operator = 'and'
      operatorIndex = i
      const weight = Number.parseFloat(token.slice(5))
      weights = [100, weight]
      break
    }
    else if (lastToken.endsWith('%') && token === '_or_') {
      operator = 'or'
      operatorIndex = i
      weights = [Number.parseFloat(lastToken), 100 - Number.parseFloat(lastToken)]
      break
    }
    lastToken = token
  }

  if (operator === null) {
    // No operator found - parse as single expression
    return parseFeatureExpression(inner)
  }

  const left = tokens.slice(0, operatorIndex).join(' ')
  const right = tokens.slice(operatorIndex + 1).join(' ')

  return {
    type: 'group',
    logic: operator,
    weights,
    children: [
      parseFeatureExpression(left),
      parseFeatureExpression(right),
    ],
  }
}

function parseVariable(line: string): [string, FeatureDef] {
  const match = line.match(/^(\S+)\s*=\s*(.+)$/)
  if (!match)
    throw new Error(`Invalid variable: ${line}`)

  const [_, symbol, expr] = match
  try {
    return [symbol, parseFeatureExpression(expr)]
  }
  catch (error) {
    throw new Error(`Error in expression: ${expr} - ${(error as Error).message}`)
  }
}

function parseBlock(block: string, globalVars: Record<string, FeatureDef>): Room {
  const lines = block.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'))

  const metadata: Meta = {}
  const variables = { ...globalVars }
  const layoutLines: string[] = []

  let inLayout = false
  for (const line of lines) {
    if (line.startsWith('@')) {
      if (inLayout)
        throw new Error('Metadata after layout')
      const [key, value] = line.slice(1).split('=').map(s => s.trim())
      metadata[key] = value || true
    }
    else if (line.includes('=')) {
      if (inLayout)
        throw new Error('Variables after layout')
      const [symbol, def] = parseVariable(line)
      variables[symbol] = def
    }
    else {
      inLayout = true
      layoutLines.push(line)
    }
  }

  // Parse layout
  const layout: FeatureDef[][] = []
  for (const line of layoutLines) {
    const row: FeatureDef[] = []
    for (const char of line) {
      const symbol = DIRECTIONAL_SYMBOLS.has(char) ? '.' : char
      const feature = variables[symbol]

      if (!feature) {
        throw new Error(`Undefined symbol: ${char}`)
      }
      row.push(feature)
    }
    layout.push(row)
  }

  return {
    name: metadata.room_name as string | undefined,
    theme: metadata.theme as string | undefined,
    difficulty: metadata.difficulty as number | undefined,
    metadata,
    variables,
    layout,
  }
}

export function parseDSL(input: string): DSLResult {
  const blocks = input.split(/^-{2,}/m).map(b => b.trim()).filter(b => b)
  if (!blocks.length)
    return { global: { variables: {} }, rooms: [] }

  // Parse global block
  const globalVars: Record<string, FeatureDef> = {}
  const globalLines = blocks[0].split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'))

  for (const line of globalLines) {
    if (line.includes('=')) {
      const [symbol, def] = parseVariable(line)
      globalVars[symbol] = def
    }
  }

  // Parse room blocks
  const rooms: Room[] = []
  for (let i = 1; i < blocks.length; i++) {
    try {
      rooms.push(parseBlock(blocks[i], globalVars))
    }
    catch (error) {
      throw new Error(`Error in room block ${i}:\n${(error as Error).message}`)
    }
  }

  return {
    global: { variables: globalVars },
    rooms,
  }
}
