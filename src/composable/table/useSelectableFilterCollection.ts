import { debouncedWatch } from '@vueuse/core'
import { ref } from '@vue/composition-api'
import type { CollectionLoader } from '@/composable/loaders/collectionLoader'
import type { DataTableGrid } from '@/types/DataTableGrid'
import type { Ref } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

interface SelectableFilterCollectionArgs {
  collection: CollectionLoader
  search: Ref
  reloadFn: Function
  searchCriteria?: string
  filterFn?: Function
}

interface UseSelectableFilterCollection {
  currentParams: Ref
  reloadCollection: Function
}

export const useSelectableFilterCollection = (data: SelectableFilterCollectionArgs): UseSelectableFilterCollection => {
  const currentParams = ref<DataTableGrid | undefined>(undefined)

  if (data.filterFn) {
    data.collection.onSuccess(() => {
      const filtered: User[] = data.collection.data.value.filter(data.filterFn)
      const diff = data.collection.data.value.length - filtered.length
      if (diff > 0) {
        data.collection.data.value = filtered
      }
    })
  }

  const reloadCollection = (params: DataTableGrid): void => {
    data.collection.updatePagination(params)
    const queryParams = { ...data.collection.pagination.value }
    if (data.search.value) {
      queryParams.filter = { [data.searchCriteria || 'name']: data.search.value }
    }
    currentParams.value = queryParams
    data.collection.loadCollection(() => data.reloadFn(currentParams.value))
  }

  debouncedWatch(
    data.search,
    () => {
      if (currentParams.value) {
        reloadCollection(currentParams.value)
      }
    },
    { debounce: 700 }
  )

  return {
    currentParams,
    reloadCollection
  }
}
