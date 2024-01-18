import { computed, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Country } from '@futureecom/futureecom-js/dist/services/setting-service'

const countriesList = ref<Country[]>([])

export const useCountries = () => {
  const loading = ref(false)

  const getCountries = async (forceReload = false): Promise<Country[]> => {
    if (countriesList.value.length === 0 || forceReload) {
      loading.value = true
      countriesList.value = await useApi().settings.countries()
      loading.value = false
    }

    return countriesList.value
  }

  const findCountryByCode = (countryCode: string): Country | undefined => {
    return countriesList.value.find((item: Country) => item.code === countryCode)
  }

  const findCountryByFlag = (flag: string): Country | undefined => {
    return countriesList.value.find((item: Country) => item.emoji === flag)
  }

  const getCountryName = (countryCode: string): string => {
    return findCountryByCode(countryCode)?.name || countryCode
  }

  return {
    countries: computed((): Country[] => countriesList.value),
    loading,
    getCountries,
    findCountryByCode,
    findCountryByFlag,
    getCountryName
  }
}
