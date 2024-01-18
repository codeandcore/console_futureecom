import { ReportViewTypeEnum } from '@/types/reports/SaleReport'
import {
  getSalesReportHeaders,
  groupedHeaders,
  groupedItemHeaders,
  rawHeaders,
  rawItemHeaders
} from '@/libs/domains/report/headers'

describe('Test for sales report headers utils', () => {
  it('returns proper headers for non-grouped order sales', () => {
    expect(getSalesReportHeaders('orders', ReportViewTypeEnum.DETAILED)).toStrictEqual(rawHeaders)
  })
  it('returns proper headers for non-grouped and non-item sales', () => {
    expect(getSalesReportHeaders('', ReportViewTypeEnum.DETAILED)).toStrictEqual(rawHeaders)
  })
  it('returns proper headers for non-grouped item sales', () => {
    expect(getSalesReportHeaders('items', ReportViewTypeEnum.DETAILED)).toStrictEqual(rawItemHeaders)
  })
  it('returns proper headers for grouped order sales', () => {
    expect(getSalesReportHeaders('orders', ReportViewTypeEnum.SUMMARY)).toStrictEqual(groupedHeaders)
  })
  it('returns proper headers for grouped and non-item sales', () => {
    expect(getSalesReportHeaders('', ReportViewTypeEnum.SUMMARY)).toStrictEqual(groupedHeaders)
  })
  it('returns proper headers for grouped item sales', () => {
    expect(getSalesReportHeaders('items', ReportViewTypeEnum.SUMMARY)).toStrictEqual(groupedItemHeaders)
  })
})
