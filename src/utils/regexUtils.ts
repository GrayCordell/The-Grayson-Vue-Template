// Function to escape special regex characters in a symbol
export function escapeRegex(symbol: string): string {
  return symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
