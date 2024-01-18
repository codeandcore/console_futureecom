import { ReportViewTypeEnum } from '@/types/reports/SaleReport'
import { getSalesReportViewType } from '@/libs/domains/report/viewType'

describe('Test for sales report view type utils', () => {
  it('returns summary enum for non-summary views', () => {
    expect(getSalesReportViewType('')).toBe(ReportViewTypeEnum.SUMMARY)
    expect(getSalesReportViewType('foo')).toBe(ReportViewTypeEnum.SUMMARY)
  })
  it('returns summary enum for summary string', () => {
    expect(getSalesReportViewType('summary')).toBe(ReportViewTypeEnum.SUMMARY)
  })
  it('returns detailed enum for detailed string', () => {
    expect(getSalesReportViewType('detailed')).toBe(ReportViewTypeEnum.DETAILED)
  })
})
