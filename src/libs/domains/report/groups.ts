import { SalesReportTypeEnum } from '@/types/reports/SaleReport'
import type { ReportItemGridGroup, SalesReportGridGroup } from '@futureecom/futureecom-js/dist/services/order-service'

export const groups: SalesReportGridGroup[] = [
  'billing_country',
  'billing_region',
  'created_at',
  'created_by',
  'customer_firstname',
  'customer_lastname',
  'discounts',
  'payment_method',
  'shipping_country',
  'shipping_method',
  'shipping_region',
  'status',
  'taxes.code',
  'taxes.rate'
]

export const itemGroups: ReportItemGridGroup[] = ['created_at', 'name', 'quantity', 'sku']

export const getSalesReportGroups = (type: SalesReportTypeEnum) => {
  return type === SalesReportTypeEnum.ITEMS ? itemGroups : groups
}
