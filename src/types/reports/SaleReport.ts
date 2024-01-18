import type { GridRequest } from '@futureecom/futureecom-js'
import type {
  SalesReportGrouped,
  SalesReportGroupedGridRequest,
  SalesReportItemGrouped,
  SalesReportItemsGroupedGridRequest
} from '@futureecom/futureecom-js/dist/services/order-service'

export type SalesReportGridRequestGrouped =
  | (SalesReportGroupedGridRequest | SalesReportItemsGroupedGridRequest)['group']

export type SalesReportGroupedData = NonNullable<SalesReportGrouped['data']>
export type SalesReportItemGroupedData = NonNullable<SalesReportItemGrouped['data']>

export interface SaleReportExtendedGridRequest extends GridRequest {
  group?: string[] | null
  with?: string[]
  groupFilters?: Record<string, unknown>
  reportType?: SalesReportTypeEnum
  reportViewType?: ReportViewTypeEnum
  collectionPage?: number
  collectionPerPage?: number
  collectionSort?: string[]
  totalsOnly?: string | boolean
}

export type SalesReportPersistentParams = Partial<
  Record<`${SalesReportTypeEnum}-${ReportViewTypeEnum}` | string, SaleReportExtendedGridRequest | undefined>
>

export enum SalesReportTypeEnum {
  ORDERS = 'orders',
  ITEMS = 'items'
}

export enum ReportViewTypeEnum {
  SUMMARY = 'summary',
  DETAILED = 'detailed'
}

export type SaleReportSortByParts = Partial<Record<'direction' | 'option' | 'total', string>>
