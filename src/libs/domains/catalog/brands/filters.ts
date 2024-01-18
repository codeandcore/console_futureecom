import type { BrandFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'

export const brandFilters: FilterDefinition<BrandFilter>[] = [
  { type: 'text', code: 'order', label: 'Sort Order' },
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'slug', label: 'Slug' },
  { type: 'date', code: 'created_at', label: 'Created At' },
  { type: 'date', code: 'updated_at', label: 'Updated At' }
]
