import { SalesReportTypeEnum } from '@/types/reports/SaleReport'

export const getSalesReportType = (val: string): SalesReportTypeEnum => {
  return val === SalesReportTypeEnum.ITEMS ? SalesReportTypeEnum.ITEMS : SalesReportTypeEnum.ORDERS
}
