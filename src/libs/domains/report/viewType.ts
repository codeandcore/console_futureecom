import { ReportViewTypeEnum } from '@/types/reports/SaleReport'

export const getSalesReportViewType = (val: string): ReportViewTypeEnum => {
  return val === ReportViewTypeEnum.DETAILED ? ReportViewTypeEnum.DETAILED : ReportViewTypeEnum.SUMMARY
}
