import { code } from 'currency-codes'
import { computed } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import Big from 'big.js'
import type { GeneralSettingsCurrency, LocaleSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Money } from '@futureecom/futureecom-js'

export const useMoney = (): UseMoney => {
  const { getSettings } = useSettings()

  const getDefaultCurrency = computed(() => {
    return getSettings<GeneralSettingsCurrency['default']>('general.currency.default').value
  })

  const getDefaultLocale = computed(() => {
    return getSettings<LocaleSettings['default']>('general.locale.default').value
  })

  const getCurrencyDecimalPoint = (currency?: string): number => {
    return code(currency || getDefaultCurrency.value || 'USA')?.digits || 0
  }

  const fromMoneyAmount = (amount: string | number, currency?: string): string => {
    const value = Number(amount)
    const position = getCurrencyDecimalPoint(currency)
    const divider = Number(new Big(10).pow(position).toString())
    return new Big(value).div(divider).toString()
  }

  const toMoneyAmount = (amount: string | number, currency?: string): string => {
    const position = getCurrencyDecimalPoint(currency)
    const decimalCut = Math.pow(10, position)
    const value = Math.trunc(Number(`${amount}`.replaceAll(',', '.')) * decimalCut) / decimalCut
    const divider = Number(new Big(10).pow(position).toString())
    return new Big(value).mul(divider).toString()
  }

  const toMoney = (amount: string | number, currency?: string): Money => ({
    amount: toMoneyAmount(amount),
    currency: currency || getDefaultCurrency.value
  })

  const withStoreCurrency = (value: Money, multiplier = 1): string => {
    if (!value?.amount) {
      value.amount = 0
    }

    const totalAmount = new Big(value.amount).mul(multiplier).toString()
    const amount = fromMoneyAmount(totalAmount, value.currency)
    const intlOptions = { style: 'currency', currency: value.currency || getDefaultCurrency.value }
    const storeLocale = getDefaultLocale.value

    return new Intl.NumberFormat(storeLocale || 'en-US', intlOptions).format(parseFloat(`${amount}`))
  }

  return {
    getCurrencyDecimalPoint,
    fromMoneyAmount,
    toMoneyAmount,
    toMoney,
    withStoreCurrency
  }
}

export interface UseMoney {
  getCurrencyDecimalPoint: (currency?: string) => number
  fromMoneyAmount: (value: string | number, currency?: string) => string
  toMoneyAmount: (amount: string | number, currency?: string) => string
  toMoney: (value: string | number, currency?: string) => Money
  withStoreCurrency: (value: Money, multiplier?: number) => string
}
