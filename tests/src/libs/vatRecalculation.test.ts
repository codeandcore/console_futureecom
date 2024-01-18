import { recalculateGross, recalculateNet } from '@/libs/vatRecalcuations'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'

describe('Vat recalculation helpers', () => {
  const vat: BaseVat = {
    name: '23% Vat',
    value: 0.23,
    id: ''
  }

  const currency = 'USD'
  const value: Money = { amount: '4400', currency }

  it('should recalculate net money value to gross', () => {
    expect(recalculateGross(value, vat)).toStrictEqual({ amount: '5412', currency })
  })
  it('should recalculate gross money to net', () => {
    expect(recalculateNet(value, vat)).toStrictEqual({ amount: '3577', currency })
  })
})
