import { useSettings } from '@/composable/repositories/useSettings'
import type {
  DateFormatSettings,
  DateTimeStyle,
  LocaleSettings,
  TimezoneSettings
} from '@futureecom/futureecom-js/dist/services/setting-service'

interface DateFormatStyle {
  date?: DateTimeStyle
  time?: DateTimeStyle
  calendar?: string
  timezone?: string
}

export const useTimezone = () => {
  const getIntl = (options?: DateFormatStyle): Intl.DateTimeFormat | undefined => {
    const { getSettings } = useSettings()
    const dateFormat = getSettings<DateFormatSettings>('general.date_format').value
    const timezone = getSettings<TimezoneSettings>('general.timezone').value
    const locale = getSettings<LocaleSettings['default']>('general.locale.default').value

    try {
      const fmtOptions: Intl.DateTimeFormatOptions = {
        timeZone: options?.timezone || timezone?.console || timezone?.global || 'UTC',
        timeStyle: options?.time || dateFormat?.console?.time || dateFormat?.global?.time || 'short',
        dateStyle: options?.date || dateFormat?.console?.date || dateFormat?.global?.date || 'short',
        calendar: options?.calendar || dateFormat?.console?.calendar || dateFormat?.global?.calendar || 'gregory'
      }
      return new Intl.DateTimeFormat(locale || 'en-US', fmtOptions)
    } catch (e: any) {
      console.error(e)
      return undefined
    }
  }

  const getFormattedTime = (time: string, fmt?: Intl.DateTimeFormat): string => {
    if (!time) {
      return time
    }

    try {
      return (fmt || getIntl())?.format(new Date(time)) || time
    } catch (e: any) {
      console.error(e)
      return time
    }
  }

  return {
    getIntl,
    getFormattedTime
  }
}
