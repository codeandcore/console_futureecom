import { computed } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import { useSettings } from '@/composable/repositories/useSettings'
import type { CountriesSettings, Country } from '@futureecom/futureecom-js/dist/services/setting-service'

export const useAllowedCountriesWithPrefix = () => {
  const { getSettings } = useSettings()
  const { countries } = useCountries()
  const allowedPrefixes = getSettings<CountriesSettings['allowed_telephones_list']>(
    'localisation.countries.allowed_telephones_list'
  )

  const allowedCountries = computed((): (Country & { text: string })[] => {
    const allowedCountries = allowedPrefixes.value
      ? countries.value.filter((country) => (allowedPrefixes.value || []).includes(country.code))
      : countries.value

    return allowedCountries
      .filter((country) => !!country.dialling.prefix)
      .map((country) => ({ ...country, text: `${country.name} (+${country.dialling.prefix})` }))
  })

  const findCountryWithPrefix = (countryCode: string): Country | undefined => {
    return allowedCountries.value.find((item) => item.code.toLowerCase() === countryCode.toLowerCase())
  }

  return {
    allowedCountries,
    findCountryWithPrefix
  }
}
