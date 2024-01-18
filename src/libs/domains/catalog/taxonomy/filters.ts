import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { TaxonomyFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'

export const taxonomyFilters: FilterDefinition<TaxonomyFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'code', label: 'Code' },
  {
    type: 'array',
    code: 'application',
    label: 'Application',
    options: [
      { text: 'Storefront', value: 'storefront' },
      { text: 'Point of Sale', value: 'pos' },
      { text: 'Console', value: 'console' }
    ]
  },
  { type: 'date', code: 'created_at', label: 'Created at' }
]
