import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { TaxRatesFilter } from '@futureecom/futureecom-js/dist/services/tax-service'

export const saleTaxFilters: FilterDefinition<TaxRatesFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'code', label: 'Code' },
  { type: 'range', code: 'rate', label: 'Rate' },
  { type: 'date', code: 'updated_at', label: 'Updated at' },
  { type: 'date', code: 'created_at', label: 'Created at' }
]
