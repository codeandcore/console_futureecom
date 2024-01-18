import { computed } from '@vue/composition-api'
import dotProp from 'dot-prop'
import type { WritableComputedRef } from '@vue/composition-api'

export const reactiveProp = <T>(state: T, onUpdate?: (val?: T | undefined) => void) => {
  return (field: keyof T | string, defaultValue?: any): WritableComputedRef<T> => {
    const path = field as string
    return computed({
      get: () => {
        return state ? dotProp.get(state, path, defaultValue || undefined) : undefined
      },
      set: (val: any): void => {
        if (onUpdate) {
          onUpdate({ ...dotProp.set(state, path, val) })
        }
      }
    })
  }
}
