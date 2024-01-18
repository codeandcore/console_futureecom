import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { ProductFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'

export const productFilters: FilterDefinition<ProductFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'sku', label: 'SKU' },
  { type: 'text', code: 'brand.name', label: 'Brand' },
  { type: 'array', code: 'tags.name', label: 'Tag Name' },
  { type: 'array', code: 'tags.slug', label: 'Tag Slug' },
  { type: 'array', code: 'customer_group', label: 'Customer Group Codes' },
  { type: 'text', code: 'taxonomy.name', label: 'Taxonomy Name' },
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
  {
    type: 'select-multiple',
    code: 'classification',
    label: 'Classification',
    options: [
      { text: 'Bundle', value: 'bundle' },
      { text: 'Common', value: 'common' }
    ]
  },
  {
    type: 'select-multiple',
    code: 'type',
    label: 'Type',
    options: [
      { text: 'Physical', value: 'physical' },
      { text: 'Digital', value: 'digital' },
      { text: 'Virtual', value: 'virtual' }
    ]
  },
  { type: 'boolean', code: 'inventory.is_available', label: 'Available' },
  { type: 'range', code: 'inventory.quantity', label: 'Quantity' },
  { type: 'money-range', code: 'price.amount', label: 'Price Amount' },
  { type: 'money-range', code: 'gross_price.amount', label: 'Gross Price Amount' },
  { type: 'money-range', code: 'gross_sale_price.amount', label: 'Gross Sale Price Amount' },
  { type: 'money-range', code: 'sale_price.amount', label: 'Sale Price Amount' },
  { type: 'date', code: 'created_at', label: 'Created At' }
]
