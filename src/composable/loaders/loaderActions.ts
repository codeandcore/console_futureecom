import { Ref, watch, WatchStopHandle } from '@vue/composition-api'

export const onSuccess = (loading: Ref, errors: Ref, callback: Function): WatchStopHandle =>
  watch(loading, async (): Promise<void> => {
    if (!loading.value && !errors.value) {
      await callback()
    }
  })

export const onError = (loading: Ref, errors: Ref, callback: Function): WatchStopHandle =>
  watch(loading, async (): Promise<void> => {
    if (errors.value) {
      await callback()
    }
  })
