import { useSettings } from '@/composable/repositories/useSettings'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { OrderSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export const useRequestedDelivery = (): UseRequestedDelivery => {
  const { getStoreSetting } = useSettings()
  const checkoutSetting: CheckoutSettings = getStoreSetting('general.checkout')
  const deliveryIsApproaching = (requestedDelivery: string | null | undefined): boolean => {
    if (!requestedDelivery) {
      return false
    }
    const { getStoreSetting } = useSettings()
    const orderSetting: OrderSettings = getStoreSetting('general.order')

    if (!orderSetting.requested_delivery_window) {
      return false
    }

    const requestedDate = new Date(requestedDelivery.split(' ').shift() || '')
    const currentDate = new Date()
    const timeDiff = requestedDate.getTime() - currentDate.getTime()
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
    if (daysDiff > 0 && daysDiff <= orderSetting.requested_delivery_window) {
      return true
    }
    return false
  }

  const excludedDates = (): Array<string | null> => {
    if (checkoutSetting && checkoutSetting.delivery_blackouts) {
      return checkoutSetting.delivery_blackouts.dates
    }
    return []
  }

  const excludedWeekdays = (): Array<string | null> => {
    if (checkoutSetting && checkoutSetting.delivery_blackouts) {
      return checkoutSetting.delivery_blackouts.weekdays
    }
    return []
  }
  const excludedHours = (): Array<string> => {
    if (checkoutSetting && checkoutSetting.delivery_blackouts) {
      return checkoutSetting.delivery_blackouts.hours
    }
    return []
  }

  const excludedHoursInMinutes = (): Array<number[]> => {
    return excludedHours().map((config): number[] => {
      return config.split('-').map((hour): number => {
        const [h, m] = hour.split(':').map(Number)
        return h * 60 + m
      })
    })
  }
  const selectedDayIsToday = (date: string) => {
    return isToday(date)
  }

  const isToday = (value: string): boolean => {
    return value === new Date().toISOString().substr(0, 10)
  }

  const availableTimes = (date: string): Array<string> => {
    const timeInterval: number = Number(checkoutSetting.delivery_interval ?? 15)
    const offset = new Date().getTimezoneOffset()

    const isExcluded = (time: number): boolean => {
      return excludedHoursInMinutes().some((hours) => {
        /**
         * excluded: 02:00 - 19:00
         *
         * open (utc): 19:15 - 01:45
         * open (warsaw): 20:15 - 02:45
         */
        if (hours[0] < hours[1] && time > hours[0] - timeInterval && time < hours[1] + timeInterval) {
          return true
        }
        /**
         * excluded: 19:00 - 02:00
         *
         * open (utc): 02:15 - 18:45
         * open (warsaw): 03:15 - 19:45
         */
        if (hours[0] > hours[1] && (time > hours[0] - timeInterval || time < hours[1] + timeInterval)) {
          return true
        }
        return false
      })
    }
    const now = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + timeInterval
    const available = []
    for (let i = 0; i < 1440; i = i + timeInterval) {
      if (isExcluded(i) || (selectedDayIsToday(date) && now > i)) {
        continue
      }
      available.push(i)
    }
    return available
      .map((t) => {
        let i = t - offset
        if (i <= 0) {
          i = 1440 + i
        }
        if (i >= 1440) {
          i = i - 1440
        }
        const hours = Math.floor(i / 60)
        const minutes = (i % 60).toString().padStart(2, '0')
        return [hours.toString().padStart(2, '0'), minutes].join(':')
      })
      .sort((a, b) => a.localeCompare(b))
  }

  const minDeliveryDate = (time: string): string => {
    const timeInterval: number = Number(checkoutSetting.delivery_interval ?? 15)
    let date = new Date()
    if (time) {
      const [hours, minutes] = time.split(':')
      if (Number(hours) <= date.getHours() && Number(minutes) <= date.getMinutes() + timeInterval) {
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      }
    }
    return date.toISOString().substr(0, 10)
  }
  return {
    deliveryIsApproaching,
    excludedDates,
    excludedWeekdays,
    availableTimes,
    minDeliveryDate,
    isToday,
    settings: checkoutSetting
  }
}

export interface UseRequestedDelivery {
  deliveryIsApproaching: (requestedDelivery: string | null | undefined) => boolean
  settings: CheckoutSettings
  excludedDates: () => Array<string | null>
  excludedWeekdays: () => Array<string | null>
  availableTimes: (date: string) => Array<string>
  minDeliveryDate: (time: string) => string
  isToday: (value: string) => boolean
}
