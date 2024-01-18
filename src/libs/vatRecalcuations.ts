import Big from 'big.js'
import type { Money } from '@futureecom/futureecom-js'
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

const getVat = (vat: Vat): Big => new Big(vat.value).add(1)

export const recalculateNet = (value: Money, vat: Vat): Money => {
  return { amount: new Big(value.amount).div(getVat(vat)).toFixed(0), currency: value.currency }
}

export const recalculateGross = (value: Money, vat: Vat): Money => {
  return { amount: new Big(value.amount).mul(getVat(vat)).toFixed(0), currency: value.currency }
}
