import { FilterDefinition } from '@/types/FilterDefinitions'
import { ShippingFilter } from '@futureecom/futureecom-js/dist/services/cart-service'

export const shippingMethodFilters: FilterDefinition<ShippingFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'code', label: 'Code' },
  { type: 'text', code: 'order', label: 'Order' },
  {
    type: 'select-multiple',
    code: 'price_type',
    label: 'Price Type',
    options: [
      { text: 'Fixed', value: 'fixed' },
      { text: 'Per Item', value: 'per_item' }
    ]
  },
  { type: 'date', code: 'created_at', label: 'Created at' },
  { type: 'date', code: 'updated_at', label: 'Updated at' }
]
