import { canada, countrySamples, greenland, unitedKingdom, unitedStates } from '~/tests/factories/countries'
import { mockedCountries } from '~/tests/mocks/mockedCountries'
import { mockedReactiveGetter } from '~/tests/helpers/mockedReactiveGetter'
import { mockedSettings } from '~/tests/mocks/mockedSettings'

describe('Composable useAllowedCountriesWithPrefix', () => {
  const setSettings = (val: unknown) => ({ getSettings: jest.fn().mockReturnValueOnce(val) })
  const setCountries = (val: unknown) => ({
    countries: mockedReactiveGetter(val)
  })

  beforeEach(() => {
    jest.resetModules()
    require('~/tests/configs/vue-composition-api-config')
  })

  it('checks if useAllowedCountriesWithPrefix uses localisation.countries.allowed_telephones_list settings', () => {
    const mock = setSettings({ value: {} })
    mockedSettings(mock)

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')

    useAllowedCountriesWithPrefix()

    expect(mock.getSettings).toBeCalled()
    expect(mock.getSettings).toBeCalledWith('localisation.countries.allowed_telephones_list')
  })

  it('returns all countries that have prefix with their texts when localisation country allowed phone settings are not set', () => {
    mockedCountries(setCountries(countrySamples))
    mockedSettings(setSettings({ value: null }))

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')
    const { allowedCountries } = useAllowedCountriesWithPrefix()
    expect(allowedCountries.value).toStrictEqual([
      { ...greenland, text: 'Greenland (+299)' },
      { ...canada, text: 'Canada (+1)' },
      { ...unitedStates, text: 'United States (+1)' },
      { ...unitedKingdom, text: 'United Kingdom (+44)' }
    ])
  })

  it('returns only countries with their texts, that are specified in settings', () => {
    mockedCountries(setCountries(countrySamples))
    mockedSettings(setSettings({ value: ['GL', 'GB'] }))

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')
    const { allowedCountries } = useAllowedCountriesWithPrefix()
    expect(allowedCountries.value).toStrictEqual([
      { ...greenland, text: 'Greenland (+299)' },
      { ...unitedKingdom, text: 'United Kingdom (+44)' }
    ])
  })

  it('returns only countries with their texts, that are specified in settings BUT skips those without any prefix', () => {
    mockedCountries(setCountries(countrySamples))
    mockedSettings(setSettings({ value: ['GL', 'AQ'] }))

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')
    const { allowedCountries } = useAllowedCountriesWithPrefix()
    expect(allowedCountries.value).toStrictEqual([{ ...greenland, text: 'Greenland (+299)' }])
  })

  it('finds a country with given prefix', () => {
    mockedCountries(setCountries(countrySamples))
    mockedSettings(setSettings({ value: ['GL', 'AQ'] }))

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')
    const { findCountryWithPrefix } = useAllowedCountriesWithPrefix()

    expect(findCountryWithPrefix('gl')).toStrictEqual({ ...greenland, text: 'Greenland (+299)' })
  })

  it('does not find a country which prefix that is not on the list', () => {
    mockedCountries(setCountries(countrySamples))
    mockedSettings(setSettings({ value: ['GL', 'AQ'] }))

    const { useAllowedCountriesWithPrefix } = require('@/composable/useAllowedCountriesWithPrefix')
    const { findCountryWithPrefix } = useAllowedCountriesWithPrefix()

    expect(findCountryWithPrefix('aq')).toStrictEqual(undefined)
  })
})
