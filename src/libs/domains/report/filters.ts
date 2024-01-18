import { OrderStatus } from '@futureecom/futureecom-js/dist/services/order-service'
import { SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { isEmptyArray } from '@/libs/arrays'
import { isObject } from '@/libs/objects'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type {
  SalesReportGridFilter,
  SalesReportGroupedBy,
  SalesReportItemGridFilter,
  SalesReportNestedGroupedBy
} from '@futureecom/futureecom-js/dist/services/order-service'
import type { SalesReportGridRequestGrouped } from '@/types/reports/SaleReport'

export const filters: FilterDefinition<SalesReportGridFilter>[] = [
  { type: 'text', code: 'order_number', label: 'Order number' },
  { type: 'money-range', code: 'summary.total_discount.amount', label: 'Summary Total Discount Amount' },
  { type: 'money-range', code: 'summary.total_due.amount', label: 'Summary Total Due Amount' },
  { type: 'money-range', code: 'summary.total_taxes.amount', label: 'Summary Total Taxes Amount' },
  { type: 'text', code: 'customer_firstname', label: 'Customer Firstname' },
  { type: 'text', code: 'customer_lastname', label: 'Customer Lastname' },
  { type: 'text', code: 'billing_country', label: 'Billing Country' },
  { type: 'text', code: 'billing_region', label: 'Billing Region' },
  { type: 'text', code: 'shipping_country', label: 'Shipping Country' },
  { type: 'text', code: 'shipping_region', label: 'Shipping Region' },
  { type: 'text', code: 'shipping_method', label: 'Shipping Method' },
  { type: 'text', code: 'payment_method', label: 'Payment Method' },
  {
    type: 'select-multiple',
    code: 'status',
    label: 'Status',
    options: [
      { text: OrderStatus.APPROVED, value: OrderStatus.APPROVED },
      { text: OrderStatus.CANCELED, value: OrderStatus.CANCELED },
      { text: OrderStatus.COMPLETED, value: OrderStatus.COMPLETED },
      { text: OrderStatus.ON_HOLD, value: OrderStatus.ON_HOLD },
      { text: OrderStatus.PLACED, value: OrderStatus.PLACED },
      { text: OrderStatus.PROCESSING, value: OrderStatus.PROCESSING },
      { text: OrderStatus.REFUNDED, value: OrderStatus.REFUNDED },
      { text: OrderStatus.SHIPPED, value: OrderStatus.SHIPPED }
    ]
  },
  { type: 'range', code: 'items.quantity_refunded', label: 'Items Quantity Refunded' },
  { type: 'range', code: 'items.quantity', label: 'Items Quantity' },
  { type: 'text', code: 'items.name', label: 'Items Name' },
  { type: 'text', code: 'items.sku', label: 'Items SKU' },
  { type: 'array', code: 'discounts', label: 'Discounts' },
  { type: 'text', code: 'taxes.code', label: 'Taxes Code' },
  { type: 'range', code: 'taxes.rate', label: 'Taxes Rate' },
  { type: 'text', code: 'created_by', label: 'Created By' },
  {
    type: 'select-multiple',
    code: 'created_from',
    label: 'Created From',
    options: [
      { text: 'Storefront', value: 'storefront' },
      { text: 'Point of Sale', value: 'pos' },
      { text: 'Console', value: 'console' },
      { text: 'API', value: 'api' }
    ]
  },
  { type: 'date', code: 'created_at', label: 'Created At' },
  { type: 'date', code: 'updated_at', label: 'Updated At' }
]

export const itemsFilters: FilterDefinition<SalesReportItemGridFilter>[] = [
  { type: 'text', code: 'id', label: 'ID' },
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'text', code: 'sku', label: 'SKU' },
  { type: 'range', code: 'quantity', label: 'Quantity' },
  {
    type: 'select-multiple',
    code: 'report.status',
    label: 'Status',
    options: [
      { text: OrderStatus.APPROVED, value: OrderStatus.APPROVED },
      { text: OrderStatus.CANCELED, value: OrderStatus.CANCELED },
      { text: OrderStatus.COMPLETED, value: OrderStatus.COMPLETED },
      { text: OrderStatus.ON_HOLD, value: OrderStatus.ON_HOLD },
      { text: OrderStatus.PLACED, value: OrderStatus.PLACED },
      { text: OrderStatus.PROCESSING, value: OrderStatus.PROCESSING },
      { text: OrderStatus.REFUNDED, value: OrderStatus.REFUNDED },
      { text: OrderStatus.SHIPPED, value: OrderStatus.SHIPPED }
    ]
  },
  { type: 'text', code: 'report.billing_country', label: 'Report Billing Country' },
  { type: 'text', code: 'report.billing_region', label: 'Report Billing Region' },
  { type: 'date', code: 'report.created_at', label: 'Report Created At' },
  { type: 'text', code: 'report.created_by', label: 'Report Created By' },
  {
    type: 'select-multiple',
    code: 'report.created_from',
    label: 'Report Created From',
    options: [
      { text: 'Storefront', value: 'storefront' },
      { text: 'Point of Sale', value: 'pos' },
      { text: 'Console', value: 'console' },
      { text: 'API', value: 'api' }
    ]
  },
  { type: 'text', code: 'report.customer_email', label: 'Report Customer Email' },
  { type: 'array', code: 'report.discounts', label: 'Report Discounts' },
  { type: 'text', code: 'report.order_number', label: 'Report Order Number' },
  { type: 'text', code: 'report.payment_method', label: 'Report Payment Method' },
  { type: 'text', code: 'report.shipping_country', label: 'Report Shipping Country' },
  { type: 'text', code: 'report.shipping_method', label: 'Report Shipping Method' },
  { type: 'text', code: 'report.shipping_region', label: 'Report Shipping Region' },
  { type: 'money-range', code: 'report.summary.total_discount.amount', label: 'Report Summary Total Discount Amount' },
  { type: 'money-range', code: 'report.summary.total_due.amount', label: 'Report Summary Total Due Amount' },
  { type: 'money-range', code: 'report.summary.total_taxes.amount', label: 'Report Summary Total Taxes Amount' },
  { type: 'money-range', code: 'total_discount.amount', label: 'Total Discount Amount' },
  { type: 'money-range', code: 'total_gross.amount', label: 'Total Gross Amount' },
  { type: 'money-range', code: 'total_taxes.amount', label: 'Total Taxes Amount' },
  { type: 'money-range', code: 'total.amount', label: 'Total Amount' },
  { type: 'date', code: 'created_at', label: 'Created At' },
  { type: 'date', code: 'updated_at', label: 'Updated At' }
]

export const getSalesReportFilters = (type: SalesReportTypeEnum) => {
  return type === SalesReportTypeEnum.ITEMS ? itemsFilters : filters
}

export const mapGroupedByToFilters = (
  groupedBy: SalesReportGridRequestGrouped,
  val: SalesReportGroupedBy
): Record<string, unknown> | undefined => {
  if (!val) {
    return undefined
  }

  const isNested = (val: unknown): val is SalesReportNestedGroupedBy => isObject(val)

  if (!isNested(val)) {
    return !isEmptyArray(val) ? { [`${groupedBy}`]: `${val}` } : {}
  }

  return Object.entries(val).reduce<SalesReportNestedGroupedBy>((prev, [key, value]) => {
    return !isEmptyArray(value) ? { ...prev, [key]: value } : prev
  }, {})
}
