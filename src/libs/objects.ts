import { isEmptyString } from '@/libs/isEmptyString'

export const isObject = (val: unknown): val is Record<string, unknown> => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

export const isEmptyObject = (val: unknown) => Boolean(isObject(val) && !Object.keys(val).length)

export const removeEmptyFields = (
  obj: Record<string, any> | null,
  remove?: Partial<Record<'nullValue' | 'emptyArray' | 'emptyString', boolean>>
): Record<string, any> | undefined => {
  const nullValue = Boolean(remove?.nullValue)
  const emptyArray = Boolean(remove?.emptyArray)
  const emptyString = Boolean(remove?.emptyString)

  const entries = Object.entries(obj || {})
    .map(([key, value]) => {
      const val = value && isObject(value) ? removeEmptyFields(value, { nullValue, emptyArray }) : value
      return [key, val]
    })
    .reduce((previous, [key, value]) => {
      if (value === undefined) {
        return { ...previous }
      }

      if (value === null && nullValue) {
        return { ...previous }
      }

      if (Array.isArray(value) && emptyArray && !value.length) {
        return { ...previous }
      }

      if (isEmptyString(value) && emptyString) {
        return { ...previous }
      }

      return { ...previous, [key]: value }
    }, {})

  return !isEmptyObject(entries) ? entries : undefined
}

export const isFile = (val: unknown): val is File => isObject(val) && 'name' in val && 'lastModified' in val
