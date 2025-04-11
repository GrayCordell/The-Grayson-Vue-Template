
function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash)

  return hash
}

function hsvToRgb(h: number, s: number, v: number): number[] {
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  return [
    Math.floor(f(5) * 255),
    Math.floor(f(3) * 255),
    Math.floor(f(1) * 255),
  ]
}

export function stringToColor(str: string): string | undefined {
  if (!str)
    return undefined

  const hash = hashString(str)
  const hue = hash % 360 // Ensure hue is [0, 360)
  const rgb = hsvToRgb(hue, 0.5, 0.95) // Saturation = 0.5, Value = 0.95 for vibrant colors

  return `#${rgb.map(value => (`00${value.toString(16)}`).slice(-2)).join('')}`
}

export function rgb(r: number, g: number, b: number): string {
  return `rgb(${r},${g},${b})`
}
