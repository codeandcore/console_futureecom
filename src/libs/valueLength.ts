import { isArray } from '@/libs/arrays'
import { isObject } from '@/libs/objects'

export const valueLength = (val: unknown): number => {
  if (isObject(val)) {
    return Object.keys(val).length
  }
  if (isArray(val) || typeof val === 'string' || typeof val === 'function') {
    return val.length
  }
  return 0
}
