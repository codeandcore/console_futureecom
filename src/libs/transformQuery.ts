export const transformQuery = (
  val: unknown,
  options?: {
    emptyString?: boolean
    nullString?: boolean
    returnSource?: boolean
    emptyArrayString?: boolean
  }
): string | unknown => {
  if (val === '' && options?.emptyString) {
    return '""'
  }

  if (val === null && options?.nullString) {
    return 'null'
  }

  if (Array.isArray(val) && !val.length && options?.emptyArrayString) {
    return '[]'
  }

  return options?.returnSource ? val : `${val}`
}
