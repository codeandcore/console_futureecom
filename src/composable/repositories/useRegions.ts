import { ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { CountryRegions } from '@futureecom/futureecom-js/dist/services/setting-service'

interface UseRegions {
  country_code: string
  regions: CountryRegions
}

const regionsList = ref<UseRegions[]>([])

export const useRegions = () => {
  const loading = ref(false)
  const regions = ref<CountryRegions>([])

  const getRegions = async (countryCode: string): Promise<CountryRegions> => {
    const api = useApi()
    const countryItem = regionsList.value.find((item: UseRegions) => item.country_code === countryCode)

    if (countryItem) {
      regions.value = countryItem.regions
      return Promise.resolve(countryItem.regions)
    }

    return new Promise((resolve, reject) => {
      loading.value = true

      api.settings
        .getCountryRegion(countryCode)
        .then((val) => {
          regionsList.value.push({ country_code: countryCode, regions: val })
          regions.value = val
          resolve(val)
        })
        .catch(reject)
        .finally(() => (loading.value = false))
    })
  }

  return {
    loading,
    regions,
    getRegions
  }
}
