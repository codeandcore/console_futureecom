import { api } from '@/libs/api'
import { computed, ref } from '@vue/composition-api'
import type { ComputedRef, Ref } from '@vue/composition-api'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'

const collection = ref<Organisation[]>([])
const currentOrganisation = ref<Organisation>()
const loadingOrganisations = ref(false)

export const useOrganisations = (): UseOrganisations => {
  const fetchOrganisations = (): Promise<void> => {
    loadingOrganisations.value = true

    return new Promise((resolve, reject) => {
      api.settings
        .organisations()
        .then((organisations: Organisation[]) => {
          collection.value = [...organisations]
          resolve()
        })
        .catch((err: any) => reject(err))
        .finally(() => (loadingOrganisations.value = false))
    })
  }

  return {
    fetchOrganisations,
    loadingOrganisations,
    currentOrganisation,
    collection: computed(() => collection.value)
  }
}

export interface UseOrganisations {
  fetchOrganisations: () => Promise<void>
  loadingOrganisations: Ref<boolean>
  currentOrganisation: Ref<Organisation | undefined>
  collection: ComputedRef<Organisation[]>
}
