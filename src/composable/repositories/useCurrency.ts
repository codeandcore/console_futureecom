import { codes } from 'currency-codes'
import { computed } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import type { GeneralSettingsCurrency } from '@futureecom/futureecom-js/dist/services/setting-service'

export const currenciesList: string[] = codes()

export const useCurrency = () => {
  const { getSettings } = useSettings()

  const getCurrencySymbol = (code: string): string => {
    return Intl.NumberFormat('en', { style: 'currency', currency: code })
      .format(0)
      .replace(/\d+([,.]\d+)?/g, '')
  }

  const storeCurrency = computed(() => {
    return getSettings<GeneralSettingsCurrency['default']>('general.currency.default').value || 'USD'
  })

  const storeCurrencySymbol = computed((): string => getCurrencySymbol(storeCurrency.value))

  return {
    getCurrencySymbol,
    storeCurrencySymbol,
    storeCurrency
  }
}
