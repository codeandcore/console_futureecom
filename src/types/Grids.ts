import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { GridHeader } from '@/types/DataTableGrid'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export interface ResourceGridOptions<Code = unknown> {
  headers?: GridHeader[]
  filters?: FilterDefinition<Code>[]
  /** @deprecated migrate grids to GridLayout and use Grid type **/
  meta?: Partial<ResponseCollection<any>['meta']>
  /** @deprecated migrate grids to GridLayout and use Grid type **/
  loading?: boolean
}

export interface Grid<T = any> {
  loading: boolean
  data: ResponseCollection<T>['data']
  meta: ResponseCollection<T>['meta']
}
