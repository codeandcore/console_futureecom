import type { CustomersGroupFilter } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'

export const customerGroupFilter: FilterDefinition<CustomersGroupFilter>[] = [
  { type: 'text', code: 'code', label: 'Code' },
  { type: 'text', code: 'name', label: 'Name' }
]
