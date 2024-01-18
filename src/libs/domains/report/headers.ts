import { ReportViewTypeEnum, SalesReportTypeEnum } from '@/types/reports/SaleReport'
import type { GridHeader } from '@/types/DataTableGrid'

export const rawHeaders: GridHeader[] = [
  { text: 'Number', value: 'order_number' },
  { text: 'Payment method', value: 'payment_method' },
  { text: 'Customer Firstname', value: 'customer_firstname' },
  { text: 'Customer Lastname', value: 'customer_lastname' },
  { text: 'Customer Email', value: 'customer_email' },
  { text: 'Billing Country', value: 'billing_country' },
  { text: 'Billing Region', value: 'billing_region' },
  { text: 'Shipping Country', value: 'shipping_country' },
  { text: 'Shipping Region', value: 'shipping_region' },
  { text: 'Shipping Method', value: 'shipping_method' },
  { text: 'Created at', value: 'created_at' }
]

export const groupedHeaders: GridHeader[] = [
  { text: 'Grouped by', value: 'grouped_by', width: '200px' },
  { text: 'Total due', value: 'meta.total_due' },
  { text: 'Total taxes', value: 'meta.total_taxes' },
  { text: 'Total discount', value: 'meta.total_discount' },
  { text: 'Total refunded', value: 'meta.total_refunded' },
  { text: 'Total items count', value: 'meta.items_count' },
  { text: 'Rows count', value: 'count' },
  { text: 'Data', value: 'actions' }
]

export const rawItemHeaders: GridHeader[] = [
  { text: 'SKU', value: 'sku' },
  { text: 'Name', value: 'name' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Quantity refunded', value: 'quantity_refunded' },
  { text: 'Total', value: 'total' },
  { text: 'Total gross', value: 'total_gross' },
  { text: 'Total taxes', value: 'total_taxes' },
  { text: 'Total discount', value: 'total_discount' },
  { text: 'Created at', value: 'created_at' }
]

export const groupedItemHeaders: GridHeader[] = [
  { text: 'Grouped by', value: 'grouped_by', width: '200px' },
  { text: 'Total', value: 'meta.total' },
  { text: 'Total gross', value: 'meta.total_gross' },
  { text: 'Total discount', value: 'meta.total_discount' },
  { text: 'Total taxes', value: 'meta.total_taxes' },
  { text: 'Total quantity', value: 'meta.quantity' },
  { text: 'Rows count', value: 'count' },
  { text: 'Data', value: 'actions' }
]

export const getSalesReportHeaders = (type: string, typeView: ReportViewTypeEnum): GridHeader[] => {
  if (type === SalesReportTypeEnum.ITEMS) {
    return typeView === ReportViewTypeEnum.SUMMARY ? groupedItemHeaders : rawItemHeaders
  }
  return typeView === ReportViewTypeEnum.SUMMARY ? groupedHeaders : rawHeaders
}
