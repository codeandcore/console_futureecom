import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { VatRatesFilter } from '@futureecom/futureecom-js/dist/services/tax-service'

export const vatFilters: FilterDefinition<VatRatesFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'range', code: 'value', label: 'Value' },
  { type: 'date', code: 'updated_at', label: 'Updated at' },
  { type: 'date', code: 'created_at', label: 'Created at' }
]
