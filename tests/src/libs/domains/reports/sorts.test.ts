import { SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { getSalesReportSorts, groupedItemsSorts, groupedSorts, itemsSorts, sorts } from '@/libs/domains/report/sorts'

describe('Test for sales report sorts utils', () => {
  it('returns proper sorts for non-grouped order sales', () => {
    expect(getSalesReportSorts(SalesReportTypeEnum.ORDERS)).toStrictEqual(sorts)
  })
  it('returns proper sorts for non-grouped item sales', () => {
    expect(getSalesReportSorts(SalesReportTypeEnum.ITEMS)).toStrictEqual(itemsSorts)
  })
  it('returns proper sorts for grouped order sales', () => {
    expect(getSalesReportSorts(SalesReportTypeEnum.ORDERS, true)).toStrictEqual(groupedSorts)
  })
  it('returns proper sorts for grouped item sales', () => {
    expect(getSalesReportSorts(SalesReportTypeEnum.ITEMS, true)).toStrictEqual(groupedItemsSorts)
  })
})
