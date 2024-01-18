import dotProp from 'dot-prop'

export const gridTemplate = () => ({
  loading: false,
  data: [],
  meta: {
    current_page: 1,
    from: null,
    last_page: 1,
    path: '',
    per_page: 5,
    to: null,
    total: 1
  }
})

export const sortCollection = <T = any>(array: Array<T>, key: string): Array<T> => {
  const sortingAsc = key.includes('-') ? -1 : 1
  const sortingKey = sortingAsc === -1 ? key.replace('-', '') : key

  return [...array].sort((a, b) => {
    const valA = dotProp.get(a, sortingKey, '')
    const valB = dotProp.get(b, sortingKey, '')

    const sortResult = valA > valB ? 1 : -1
    return sortResult * sortingAsc
  })
}

export const paginateCollection = (totalItems: number, page: number = 1, perPage: number = 10) => {
  const nextTotalPages = Math.ceil(Number(totalItems / perPage))

  const currentPage = page < nextTotalPages ? page : nextTotalPages
  const lastPage = perPage > 0 ? Math.ceil(totalItems / perPage) : 1

  const fromItemIndex = currentPage > 1 ? (currentPage - 1) * perPage : 0
  const toItemIndex = perPage > 0 ? fromItemIndex + perPage : totalItems

  return {
    current_page: currentPage > 0 ? currentPage : 1,
    per_page: perPage,
    last_page: lastPage,
    from_item_index: fromItemIndex,
    to_item_index: toItemIndex,
    total: totalItems
  }
}
