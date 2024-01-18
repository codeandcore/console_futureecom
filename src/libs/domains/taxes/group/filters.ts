import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { TaxRateGroupFilter } from '@futureecom/futureecom-js/dist/services/tax-service'

export const saleTaxGroupFilters: FilterDefinition<TaxRateGroupFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'customer_group', label: 'Customer group' },
  { type: 'text', code: 'zone_code', label: 'Zone code' },
  { type: 'text', code: 'taxonomy', label: 'Taxonomy' },
  { type: 'text', code: 'rates.code', label: 'Rates code' },
  { type: 'text', code: 'rates.name', label: 'Rates name' },
  { type: 'range', code: 'rates.rate', label: 'Rates rate' },
  { type: 'date', code: 'updated_at', label: 'Updated at' },
  { type: 'date', code: 'created_at', label: 'Created at' }
]
