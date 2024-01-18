import { api } from '@/libs/api'
import { ref } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

const collection = ref<Store[]>([])
const currentStore = ref<Store>()

export const useStores = () => {
  const loadingStores = ref(false)

  const fetchStores = async (orgId: number): Promise<void> => {
    loadingStores.value = true

    await api
      .usingOrganisation(orgId)
      .settings.stores(orgId)
      .then((value) => (collection.value = [...value]))
      .finally(() => (loadingStores.value = false))
  }

  const getStore = (id: number): Store | undefined => {
    return collection.value.find((store) => store.id === id)
  }

  const setStores = (stores: Store[]) => {
    collection.value = [...stores]
  }

  return {
    fetchStores,
    loadingStores,
    currentStore,
    getStore,
    collection,
    setStores
  }
}
