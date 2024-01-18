import { getDateRange } from '@/libs/domains/report/formatters'

describe('Test for sales report getDateRange helper', () => {
  beforeAll(() => jest.useFakeTimers().setSystemTime(new Date('2023-01-01')))

  afterAll(() => jest.useRealTimers())

  it('gets previous month from beginning to end', () => {
    expect(getDateRange('month', -1)).toStrictEqual({ gte: '2022-12-01', lte: '2022-12-31' })
  })
  it('gets current month from beginning to end', () => {
    expect(getDateRange('month', 0)).toStrictEqual({ gte: '2023-01-01', lte: '2023-01-31' })
  })
  it('gets previous year from beginning to end', () => {
    expect(getDateRange('year', -1)).toStrictEqual({ gte: '2022-01-01', lte: '2022-12-31' })
  })
  it('gets current year from beginning to end', () => {
    expect(getDateRange('year', 0)).toStrictEqual({ gte: '2023-01-01', lte: '2023-12-31' })
  })
})
