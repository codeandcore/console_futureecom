import { ref } from '@vue/composition-api'
import { v4 as uuidv4 } from 'uuid'
import type { Toast } from '@/types/Toasts'
import type { TranslateResult } from 'vue-i18n'

type ToastType = 'success' | 'warning' | 'error' | 'custom'

const toastsQueue = ref<Toast[]>([])

export const useToasts = () => {
  const clearExpired = (uuid: string, type: ToastType = 'custom'): NodeJS.Timeout => {
    const expirations: Record<ToastType, number> = {
      custom: 3000,
      success: 3000,
      warning: 3000,
      error: 10000
    }
    return setTimeout(async function () {
      toastsQueue.value = toastsQueue.value.reduce((prev: Toast[], current) => {
        return current.uuid === uuid || !current.visible ? prev : [...prev, current]
      }, [])
    }, expirations[type])
  }

  const addCustomToast = (type: ToastType, msg: string | TranslateResult): Toast => {
    const toast = { type, msg, uuid: uuidv4(), visible: true }
    toastsQueue.value.push(toast)
    clearExpired(toast.uuid, type)
    return toast
  }

  const addSuccessToast = (msg: string | TranslateResult): Toast => addCustomToast('success', msg)
  const addWarningToast = (msg: string | TranslateResult): Toast => addCustomToast('warning', msg)
  const addErrorToast = (msg: string | TranslateResult): Toast => addCustomToast('error', msg)

  return {
    toasts: toastsQueue,
    addSuccessToast,
    addWarningToast,
    addErrorToast,
    addCustomToast
  }
}
