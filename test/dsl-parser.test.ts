// dsl-parser.test.ts
import { describe, expect, it } from 'vitest'
import { parseDSL } from '../src/dsl-parser'

// Current issues
// 1. A global variable is required, otherwise no rooms get local variables.
// 2. Types don't always match the expected type. true can be "true" or true, numbers can be strings or numbers.

const TEST_DSL = `
TOP = DONT_REMOVE_THIS_VAR // at least one global is required at the moment

// Global declarations
# = wall
. = air
^ = air
k = (idol _and_ air)
? = (wall _or_ air)

---
g = gold @value=200
s = snake @low_health @named=snakey
t = ((trap 10%_or_ air) 20%_or_ wall)
B = idol

@room_name=room1
@theme=temple
@difficulty=3
@has_gold=true

#####
#...#
#g.s#
#.t.#
##B##
##^##
##^##
---
`

describe('dSL Parser', () => {
  it('should parse global variables', () => {
    const result = parseDSL(TEST_DSL)

    expect(result.global.variables['#']).toEqual({
      type: 'simple',
      feature: 'wall',
      meta: {},
    })

    expect(result.global.variables.k).toEqual({
      type: 'group',
      logic: 'and',
      weights: [100, 100],
      children: [
        { type: 'simple', feature: 'idol', meta: {} },
        { type: 'simple', feature: 'air', meta: {} },
      ],
    })
  })

  it('should parse room metadata', () => {
    const result = parseDSL(TEST_DSL)
    const room = result.rooms[0]

    expect(room.name).toBe('room1')
    expect(room.theme).toBe('temple')
    expect(room.difficulty).toBe('3')
    expect(room.metadata).toEqual({
      room_name: 'room1',
      theme: 'temple',
      difficulty: '3',
      has_gold: 'true',
    })
  })

  it('should parse room variables with metadata', () => {
    const result = parseDSL(TEST_DSL)
    const room = result.rooms[0]

    expect(room.variables.g).toEqual({
      type: 'simple',
      feature: 'gold',
      meta: { value: 200 },
    })

    expect(room.variables.s).toEqual({
      type: 'simple',
      feature: 'snake',
      meta: { low_health: true, named: 'snakey' },
    })
  })

  it('should parse complex probability groups', () => {
    const result = parseDSL(TEST_DSL)
    const room = result.rooms[0]
    const tVar = room.variables.t

    expect(tVar).toEqual({
      type: 'group',
      logic: 'or',
      weights: [20, 80],
      children: [
        {
          type: 'group',
          logic: 'or',
          weights: [10, 90],
          children: [
            { type: 'simple', feature: 'trap', meta: {} },
            { type: 'simple', feature: 'air', meta: {} },
          ],
        },
        { type: 'simple', feature: 'wall', meta: {} },
      ],
    })
  })

  it('should parse layout correctly', () => {
    const result = parseDSL(TEST_DSL)
    const room = result.rooms[0]

    // get max length row

    expect(room.layout.length).toBe(7) // 7 columns
    expect(room.layout[0].length).toBe(5) // 5 rows
    expect(room.layout[0].map(f => f.type)).toEqual(
      Array.from({ length: 5 }).fill('simple'),
    )

    // Verify directional symbols resolve to air
    const airDef = result.global.variables['.']!
    expect(room.layout[5][2]).toEqual(airDef)
  })

  it('should handle nested groups', () => {
    const dsl = `
TOP = DONT_REMOVE_THIS_VAR // at least one global is required at the moment
# = wall
X = ((wall 30%_or_ (air _and_40% bat)) _or_ (gold _and_ torch))
. = air
---
#####
#X.X#
#####
    `

    const result = parseDSL(dsl)
    const xVar = result.rooms[0].variables.X!

    expect(xVar).toEqual({
      type: 'group',
      logic: 'or',
      weights: [50, 50],
      children: [
        {
          type: 'group',
          logic: 'or',
          weights: [30, 70],
          children: [
            { type: 'simple', feature: 'wall', meta: {} },
            {
              type: 'group',
              logic: 'and',
              weights: [100, 40],
              children: [
                { type: 'simple', feature: 'air', meta: {} },
                { type: 'simple', feature: 'bat', meta: {} },
              ],
            },
          ],
        },
        {
          type: 'group',
          logic: 'and',
          weights: [100, 100],
          children: [
            { type: 'simple', feature: 'gold', meta: {} },
            { type: 'simple', feature: 'torch', meta: {} },
          ],
        },
      ],
    })
  })

  it('should handle metadata variations', () => {
    const dsl = `


TOP = DONT_REMOVE // at least one global is required at the moment
---
. = air
X = (wall _and_ air)
# = wall

@flag
@number=42
@bool=true
@string=hello


#####
##X##
#####
---


---
. = air
X = (wall _and_ air)
# = air

#####
##X##
#####
---
    `

    const result = parseDSL(dsl)
    // log
    // console.log(JSON.stringify(result, null, 2))
    const metadata = result.rooms[0].metadata

    expect(metadata).toEqual({
      flag: true,
      number: '42',
      bool: 'true',
      string: 'hello',
    })
  })

  it('should throw on undefined symbols', () => {
    const dsl = `
TOP = DONT_REMOVE_THIS_VAR // at least one global is required at the moment
# = wall
---
#X#
---
    `
    expect(() => parseDSL(dsl)).toThrow('Undefined symbol: X')
  })

  it('should throw on invalid expressions', () => {
    const dsl = `
X = (invalid expression
---
    `

    expect(() => parseDSL(dsl)).toThrow('Error in expression')
  })
})
