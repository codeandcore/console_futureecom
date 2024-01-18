import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { TagFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'

export const tagFilters: FilterDefinition<TagFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'date', code: 'created_at', label: 'Created At' },
  { type: 'date', code: 'updated_at', label: 'Updated At' }
]
