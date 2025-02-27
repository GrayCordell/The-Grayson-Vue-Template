import { useI18n } from 'vue-i18n'

/**
 * Description:
 * Notes:
 */
const toMilliseconds = (hrs: number, min: number, sec: number) => (hrs * 60 * 60 + min * 60 + sec) * 1000
export const MINUTE = toMilliseconds(0, 1, 0)
export const SECOND = toMilliseconds(0, 0, 1)

export const getDate = (timestamp: number) => {
  const locale = useI18n?.()?.locale || { value: 'en-US' }

  const lang = locale.value
  if (!lang || lang === '')
    return ''
  const longEnUSFormatter = new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' })
  return longEnUSFormatter.format(new Date(timestamp))
}
