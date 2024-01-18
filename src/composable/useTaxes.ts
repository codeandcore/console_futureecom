import { computed } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export const useTaxes = () => {
  const { getSettings } = useSettings()
  const taxSettings = getSettings<TaxesSettings>('general.taxes')

  const vatEnabled = computed((): boolean => (taxSettings.value.type || 'sales') === 'vat')
  const vatInPrice = computed((): boolean => taxSettings.value.vat_in_price || false)
  const netDisabled = computed((): boolean => vatEnabled.value && vatInPrice.value)
  const grossDisabled = computed((): boolean => {
    return (vatEnabled.value && !vatInPrice.value) || !vatEnabled.value
  })

  return {
    vatEnabled,
    vatInPrice,
    netDisabled,
    grossDisabled
  }
}
