import type { defaultDecoder } from 'qs'

export const decodeRouteQuery = (
  str: string,
  defaultDecoder: defaultDecoder,
  charset: string,
  type: 'key' | 'value'
) => {
  if (type !== 'value') {
    return str
  }

  if (str === 'null') {
    return null
  }

  if (str === '[]') {
    return []
  }

  return defaultDecoder(str)
}
