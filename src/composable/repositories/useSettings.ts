import { computed, ref } from '@vue/composition-api'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { ComputedRef } from '@vue/composition-api'
import type { SettingCode } from '@futureecom/futureecom-js/dist/services/setting-service'

const settings = ref<{ [key: string]: any } | any>()

export const useSettings = () => {
  const isSettingCode = (val: string): val is SettingCode =>
    [
      '',
      'auth',
      'catalog',
      'customers',
      'general.avalara',
      'general.brand',
      'general.checkout',
      'general.cloudinary',
      'general.contact',
      'general.currency',
      'general.customer',
      'general.date_format',
      'general.icount',
      'general.locale',
      'general.order',
      'general.quote',
      'general.shippo',
      'general.star_printer',
      'general.taxes',
      'general.template',
      'general.timezone',
      'general',
      'localisation',
      'notifications',
      'notifications.channels',
      'notifications.mailing',
      'notifications.sms',
      'notifications.smtp',
      'plugins',
      'workflows'
    ].includes(val)

  const loading = ref(false)

  /** @deprecated, use getSettings instead **/
  const getStoreSetting = (code?: string): any => {
    return code ? dotProp.get(settings.value, code) : settings.value
  }

  const getSettings = <T>(code = ''): ComputedRef<T> => {
    return computed(() => (code ? dotProp.get(settings.value, code) : settings.value))
  }

  const setSettingProp = (code: string, value: any): void => {
    if (!code) {
      settings.value = value
      return
    }

    dotProp.set(settings.value, code, value)
  }

  const fetchSettings = async (code: string = '', forceReload = false): Promise<any> => {
    if (!getSettings(code).value || forceReload) {
      loading.value = true
      return (
        useApi()
          //@ts-expect-error
          .settings.getSetting(code)
          .then((value) => setSettingProp(code, value))
          .finally(() => (loading.value = false))
      )
    }
  }

  const updateSettings = async (code: string, value: any): Promise<any> => {
    if (!isSettingCode(code)) {
      return Promise.reject('Unable to find setting code')
    }

    loading.value = true

    return useApi()
      .settings.updateSetting(code, value)
      .then((value) => setSettingProp(code, value))
      .catch((err: unknown) => Promise.reject(err))
      .finally(() => (loading.value = false))
  }

  return {
    settings: computed(() => settings.value),
    loading,
    fetchSettings,
    updateSettings,
    setSettingProp,
    getSettings,
    getStoreSetting
  }
}
