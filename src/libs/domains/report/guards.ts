import { groupedItemsSorts, groupedSorts } from '@/libs/domains/report/sorts'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'
import type {
  SalesReportGridRequest,
  SalesReportGroupedByValueType,
  SalesReportGroupedGridRequest,
  SalesReportGroupedGridSort,
  SalesReportItemGroupedGridSort,
  SalesReportItemsGridRequest,
  SalesReportItemsGroupedGridRequest,
  SalesReportNestedGroupedBy
} from '@futureecom/futureecom-js/dist/services/order-service'

const hasGroup = (val: SaleReportExtendedGridRequest) => val.group !== undefined

export const isSalesReportOrdersGridRequest = (
  val: SaleReportExtendedGridRequest,
  type: string
): val is SalesReportGridRequest => {
  return !hasGroup(val) && type === 'orders'
}

export const isSalesReportGroupedOrdersGridRequest = (
  val: SaleReportExtendedGridRequest,
  type: string
): val is SalesReportGroupedGridRequest => {
  return hasGroup(val) && type === 'orders'
}

export const isSalesReportItemsGridRequest = (
  val: SaleReportExtendedGridRequest,
  type: string
): val is SalesReportItemsGridRequest => {
  return !hasGroup(val) && type === 'items'
}

export const isSalesReportGroupedItemsGridRequest = (
  val: SaleReportExtendedGridRequest,
  type: string
): val is SalesReportItemsGroupedGridRequest => {
  return hasGroup(val) && type === 'items'
}

export const isSalesReportItemGroupSort = (val: string[]): val is SalesReportItemGroupedGridSort[] => {
  return !!val.length && val.every((item) => groupedItemsSorts.includes(item))
}
export const isSalesReportGroupSort = (val: string[]): val is SalesReportGroupedGridSort[] => {
  return !!val.length && val.every((item) => groupedSorts.includes(item))
}

export const isItemGroupedBySimple = (groups: unknown): groups is SalesReportGroupedByValueType => {
  return groups === null || ['string', 'number'].includes(typeof groups) || Array.isArray(groups)
}

export const isItemGroupedByNested = (groups: unknown): groups is SalesReportNestedGroupedBy => {
  return !isItemGroupedBySimple(groups)
}
