import type { CategoryFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'

export const categoryFilters: FilterDefinition<CategoryFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'code', label: 'Code' },
  { type: 'date', code: 'created_at', label: 'Created At' },
  { type: 'date', code: 'updated_at', label: 'Updated At' }
]
