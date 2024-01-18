export const isArray = (val: unknown): val is unknown[] => Array.isArray(val)

export const isEmptyArray = (val: unknown) => Boolean(isArray(val) && !val.length)

export const arrayOrNull = (val: unknown): null | unknown[] => {
  if (isEmptyArray(val) || `${val}` === 'null') {
    return null
  }
  return isArray(val) ? val : null
}
