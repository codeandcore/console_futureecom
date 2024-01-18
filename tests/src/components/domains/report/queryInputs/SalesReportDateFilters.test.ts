import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportDateFilters from '@/components/domains/reports/queryInputs/SalesReportDateFilters.vue'

describe('SalesReportDateFilters input component test', () => {
  const attributes = {
    component: 'reports-query-date-filters',
    buttons: 'reports-query-date-filters-buttons',
    range: 'filter-date-range-input',
    lastMonthBtn: 'reports-query-date-filters-last-month',
    thisMonthBtn: 'reports-query-date-filters-this-month',
    lastYearBtn: 'reports-query-date-filters-last-year',
    thisYearBtn: 'reports-query-date-filters-this-year'
  }

  const getComponent = () => screen.getByTestId(attributes.component)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportDateFilters component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportDateFilters, { propsData })
    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should emit selected range from predefined buttons', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

    const unchanged = { with: ['data'] }
    const lastMonth = { filter: { created_at: { gte: '2022-12-01', lte: '2022-12-31' } } }
    const thisMonth = { filter: { created_at: { gte: '2023-01-01', lte: '2023-01-31' } } }
    const lastYear = { filter: { created_at: { gte: '2022-01-01', lte: '2022-12-31' } } }
    const thisYear = { filter: { created_at: { gte: '2023-01-01', lte: '2023-12-31' } } }

    const wrapper = renderWithMainApp(SalesReportDateFilters, { propsData: { value: { ...unchanged } } })

    const buttons = screen.getByTestId(attributes.buttons).children
    expect(buttons.length).toEqual(4)

    const lastMonthBtn = screen.getByTestId(attributes.lastMonthBtn)
    const thisMonthBtn = screen.getByTestId(attributes.thisMonthBtn)
    const lastYearBtn = screen.getByTestId(attributes.lastYearBtn)
    const thisYearBtn = screen.getByTestId(attributes.thisYearBtn)

    await fireEvent.click(lastMonthBtn)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, ...lastMonth })

    await fireEvent.click(thisMonthBtn)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, ...thisMonth })

    await fireEvent.click(lastYearBtn)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, ...lastYear })

    await fireEvent.click(thisYearBtn)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, ...thisYear })

    jest.useRealTimers()
  })
})
