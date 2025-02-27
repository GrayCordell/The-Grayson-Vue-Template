export const setCookie = (name: string, value: string | number, days: number | undefined) => {
  let expires = ''
  if (days !== undefined) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}

export const getCookie = (name: string) => {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ')
      c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0)
      return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const eraseCookie = (name: string) => {
  const cookie = getCookie(name)
  if (cookie !== null) {
    setCookie(name, '', -1)
    console.log('cookie erased')
  }
}
