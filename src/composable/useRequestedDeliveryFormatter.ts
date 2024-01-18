import { useSettings } from '@/composable/repositories/useSettings'
import { useTimezone } from '@/composable/useTimezone'
import type { LocaleSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export const useRequestedDeliveryFormat = (value: string, fmt?: Intl.DateTimeFormat): string => {
  if (!value) {
    return value
  }

  const [date, time] = value.split(' ')

  if (time) {
    return useTimezone().getFormattedTime(value, fmt)
  }

  const { getSettings } = useSettings()
  const locale = getSettings<LocaleSettings['default']>('general.locale.default').value
  return new Date(date).toLocaleDateString(locale)
}
