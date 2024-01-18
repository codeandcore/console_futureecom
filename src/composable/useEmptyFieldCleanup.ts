type ObjType = { [p: string]: any }

/** @deprecated prefer using @/libs/removeEmptyFields **/
export const useEmptyFieldCleanup = (obj?: ObjType | null): ObjType | undefined => {
  if (!obj) {
    return undefined
  }
  if (Array.isArray(obj)) {
    return obj.length ? obj : undefined
  }
  const entries = Object.entries(obj)
    .map(([key, value]) => [key, value && typeof value === 'object' ? useEmptyFieldCleanup(value) : value])
    .reduce((previous: ObjType, [key, value]) => {
      if (value) {
        previous[key] = value
      }
      return previous
    }, {})

  return Object.keys(entries).length ? entries : undefined
}
