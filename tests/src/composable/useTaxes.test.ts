import { mockedSettings } from '~/tests/mocks/mockedSettings'

describe('Composable useTaxes', () => {
  const setSettings = (val: unknown) => ({ getSettings: jest.fn().mockReturnValue(val) })

  beforeEach(() => {
    jest.resetModules()
    require('~/tests/configs/vue-composition-api-config')
  })

  it('checks if useTaxes uses general.taxes settings', () => {
    const mock = setSettings({ value: {} })
    mockedSettings(mock)

    const { useTaxes } = require('@/composable/useTaxes')

    useTaxes()

    expect(mock.getSettings).toBeCalled()
    expect(mock.getSettings).toBeCalledWith('general.taxes')
  })

  it('checks if vat is enabled with taxes setting type as vat', () => {
    mockedSettings(setSettings({ value: { type: 'vat' } }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatEnabled.value).toBeTrue()
  })

  it('checks if vat is disabled with taxes setting type as sales', () => {
    mockedSettings(setSettings({ value: { type: 'sales' } }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatEnabled.value).toBeFalse()
  })

  it('checks if vat is disabled when taxes type is not provided ', () => {
    mockedSettings(setSettings({ value: {} }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatEnabled.value).toBeFalse()
  })

  it('checks if vat in price is enabled with vat in price setting enabled too', () => {
    mockedSettings(setSettings({ value: { vat_in_price: true } }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatInPrice.value).toBeTrue()
  })

  it('checks if vat in price is disabled with vat in price setting disabled too', () => {
    mockedSettings(setSettings({ value: { vat_in_price: false } }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatInPrice.value).toBeFalse()
  })

  it('checks if vat in price is disabled when vat in price setting is not provided', () => {
    mockedSettings(setSettings({ value: { vat_in_price: false } }))

    const { useTaxes } = require('@/composable/useTaxes')
    expect(useTaxes().vatInPrice.value).toBeFalse()
  })

  it('checks if net is disabled and gross enabled on vat in price and type as vat', () => {
    mockedSettings(setSettings({ value: { vat_in_price: true, type: 'vat' } }))

    const { netDisabled, grossDisabled } = require('@/composable/useTaxes').useTaxes()
    expect(netDisabled.value).toBeTrue()
    expect(grossDisabled.value).toBeFalse()
  })

  it('checks if net is enabled and gross disabled on disabled vat in price and type as vat', () => {
    mockedSettings(setSettings({ value: { vat_in_price: false, type: 'vat' } }))

    const { netDisabled, grossDisabled } = require('@/composable/useTaxes').useTaxes()
    expect(netDisabled.value).toBeFalse()
    expect(grossDisabled.value).toBeTrue()
  })

  it('checks if net is enabled and gross disabled on disabled vat in price and type as sales', () => {
    mockedSettings(setSettings({ value: { vat_in_price: false, type: 'sales' } }))

    const { netDisabled, grossDisabled } = require('@/composable/useTaxes').useTaxes()
    expect(netDisabled.value).toBeFalse()
    expect(grossDisabled.value).toBeTrue()
  })

  it('checks if net is enabled and gross disabled on enabled vat in price and type as sales', () => {
    mockedSettings(setSettings({ value: { vat_in_price: true, type: 'sales' } }))

    const { netDisabled, grossDisabled } = require('@/composable/useTaxes').useTaxes()
    expect(netDisabled.value).toBeFalse()
    expect(grossDisabled.value).toBeTrue()
  })
})
