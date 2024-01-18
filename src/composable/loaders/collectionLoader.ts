import { onError, onSuccess } from '@/composable/loaders/loaderActions'
import { ref } from '@vue/composition-api'
import type { DataTableGrid } from '@/types/DataTableGrid'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { Ref, WatchStopHandle } from '@vue/composition-api'

export interface Metadata {
  current_page: number
  from: null | number
  last_page: number
  path: string
  per_page: number
  to: null | number
  total: number
}

/** @deprecated, use async/await or Promise with then => catch => finally flow **/
export default (): CollectionLoader => {
  const loading = ref(false)
  const data = ref([])
  const links = ref({})
  const metadata = ref<Metadata | {}>({})
  const errors = ref(null)
  const collectionParams = ref({})
  const pagination = ref<GridRequest>({
    perPage: 10,
    page: 1
  })

  const onLoaderSuccess = (callback: Function): WatchStopHandle => onSuccess(loading, errors, callback)
  const onLoaderError = (callback: Function): WatchStopHandle => onError(loading, errors, callback)

  const loadCollection = async (callback: Function): Promise<void> => {
    try {
      loading.value = true
      const callbackResult = await callback()
      data.value = callbackResult.data
      links.value = callbackResult.links
      metadata.value = callbackResult.meta
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const updatePagination = (values: DataTableGrid): void => {
    const { page, itemsPerPage, sortBy, sortDesc } = values
    const sort: string[] = (sortBy || []).map((item, index) => (sortDesc[index] ? `-${item}` : item))
    pagination.value = { perPage: itemsPerPage || 10, page: page, sort }
  }

  const reassignParams = (params: any): void => {
    let page,
      perPage,
      sort,
      filter = undefined

    if (params.pagination) {
      page = params.pagination.page
      perPage = params.pagination.perPage
    }
    if (params.grid) {
      sort = params.grid.sort
    }
    if (params.filter) {
      filter = params.filter
    }
    collectionParams.value = { page, perPage, sort, filter }
  }

  const reloadCollection = (params: any, callback: Function): void => {
    updatePagination(params)
    const { page, perPage, sort } = pagination.value
    const { filter } = params
    collectionParams.value = { page, perPage, sort, filter }
    loadCollection(() => callback({ page, perPage, sort, filter }))
  }

  return {
    loading,
    data,
    links,
    pagination,
    metadata,
    collectionParams,
    loadCollection,
    onSuccess: onLoaderSuccess,
    onError: onLoaderError,
    updatePagination,
    reassignParams,
    reloadCollection
  }
}

export interface CollectionLoader {
  loading: Ref
  data: Ref
  links: Ref
  pagination: Ref
  metadata: Ref
  collectionParams: Ref
  loadCollection: Function
  onError: Function
  onSuccess: Function
  updatePagination: Function
  reassignParams: Function
  reloadCollection: Function
}
