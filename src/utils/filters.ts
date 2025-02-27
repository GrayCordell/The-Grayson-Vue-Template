export const filters = {
  str_limit(value: string | undefined | null, size: number) {
    if (!value)
      return ''
    value = value.toString()

    if (value.length <= size)
      return value

    return `${value.substring(0, size)}...`
  },
  str_capitalize(value: string) {
    if (!value)
      return ''
    value = value.toString()

    if (value[0] === '-' || value[0] === ' ' || value[0] === '_' || value[0] === '.')
      return value[1].toUpperCase() + value.slice(2)
    else
      return value.charAt(0).toUpperCase() + value.slice(1)
  },
}
