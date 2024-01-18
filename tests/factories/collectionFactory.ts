import { faker } from '@faker-js/faker'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { FactoryContext } from './helpers/factoryContext'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export const gridFactory = <T>(
  dataFactory: () => T,
  context?: FactoryContext<ResponseCollection<T>>
): ResponseCollection<T> => {
  const url = faker.internet.url()
  const data = context?.override?.data || faker.helpers.multiple(() => dataFactory(), { count: { min: 5, max: 30 } })

  const meta = gridFactoryMeta(data, { override: { path: url } })
  return {
    data: data.slice((meta.from || 1) - 1, (meta.to || 1) - 1),
    meta: gridFactoryMeta(data, { override: { path: url } }),
    links: gridFactoryLinks(url),
    ...context?.override
  }
}

export const gridFactoryMeta = <T = unknown>(
  items: unknown[],
  context?: FactoryContext<ResponseCollection<T>['meta']>
): ResponseCollection<T>['meta'] => {
  const total = items.length
  const perPage = faker.number.int({ min: 5, max: 20 })
  const lastPage = Math.ceil(total / perPage)
  const currentPage = faker.number.int({ min: 1, max: lastPage })

  const to = currentPage * perPage >= total ? total : currentPage * perPage
  const from = currentPage === 1 ? 1 : to - perPage + 1

  return {
    total,
    per_page: perPage,
    last_page: lastPage,
    current_page: currentPage,
    from,
    to,
    path: faker.internet.url(),
    ...context?.override
  }
}

export const gridFactoryLinks = (url: string) => {
  return {
    first: url,
    last: url,
    prev: valueOrNull(url),
    next: valueOrNull(url)
  }
}
