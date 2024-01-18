import { Ref, WatchStopHandle, ref } from '@vue/composition-api'
import { onError, onSuccess } from '@/composable/loaders/loaderActions'

/** @deprecated, use async/await or Promise with then => catch => finally flow **/
export const dataLoader = (indeterminateLoading = false, initValue = null as [] | null): DataLoader => {
  const data = ref(initValue)
  const loading = ref(false)
  const errors = ref(null)

  const onLoaderSuccess = (callback: (...args: any) => any): WatchStopHandle => onSuccess(loading, errors, callback)
  const onLoaderError = (callback: (...args: any) => any): WatchStopHandle => onError(loading, errors, callback)

  const loadData = async (callback: (...args: any) => any): Promise<void> => {
    try {
      errors.value = null
      data.value = null
      loading.value = true
      const callbackResult = await callback()
      data.value = callbackResult?.data ?? callbackResult
      loading.value = indeterminateLoading
    } catch (e: any) {
      errors.value = e.response?.data
      loading.value = false
      return Promise.reject(errors.value)
    }
  }

  return {
    loading,
    errors,
    data,
    loadData,
    onSuccess: onLoaderSuccess,
    onError: onLoaderError
  }
}

export interface DataLoader {
  loading: Ref<boolean>
  errors: Ref
  data: Ref
  loadData: (callback: (...args: any) => any) => Promise<void>
  onError: (callback: (...args: any) => any) => WatchStopHandle
  onSuccess: (callback: (...args: any) => any) => WatchStopHandle
}
