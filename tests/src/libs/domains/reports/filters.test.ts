import { SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { filters, getSalesReportFilters, itemsFilters, mapGroupedByToFilters } from '@/libs/domains/report/filters'

describe('Test for sales report filter utils', () => {
  it('returns proper filters for sales', () => {
    expect(getSalesReportFilters(SalesReportTypeEnum.ORDERS)).toStrictEqual(filters)
  })
  it('returns proper filters for items', () => {
    expect(getSalesReportFilters(SalesReportTypeEnum.ITEMS)).toStrictEqual(itemsFilters)
  })
})

describe('Test for mapping group by from filters', function () {
  it('returns undefined if value not provided', () => {
    const result = mapGroupedByToFilters(['shipping_country'], '')
    expect(result).toStrictEqual(undefined)
  })
  it('maps empty array to empty object', () => {
    const result = mapGroupedByToFilters(['shipping_country'], [])
    expect(result).toStrictEqual({})
  })
  it('maps array of values to string, framed by keyed object', () => {
    const result = mapGroupedByToFilters(['shipping_country'], ['foo', 'bar'])
    expect(result).toStrictEqual({ shipping_country: 'foo,bar' })
  })
  it('maps single key object with an array to another ', () => {
    const result = mapGroupedByToFilters(['billing_country'], {
      shipping_country: ['foo', 'bar']
    })
    expect(result).toStrictEqual({ shipping_country: ['foo', 'bar'] })
  })
  it('maps multiple keys with different values correctly', () => {
    const result = mapGroupedByToFilters(['shipping_country', 'status'], {
      shipping_country: ['foo', 'bar'],
      status: 'sample'
    })
    expect(result).toStrictEqual({ shipping_country: ['foo', 'bar'], status: 'sample' })
  })
})
