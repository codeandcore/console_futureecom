import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportQueryInputs from '@/components/domains/reports/queryInputs/SalesReportQueryInputs.vue'

describe('SalesReportQueryInputs input component test', () => {
  const attributes = {
    component: 'sales-report-query-input',
    dateFilters: 'sales-report-query-input-date-filters',
    groupBy: 'sales-report-group-by',
    with: 'sales-report-with',
    sortBy: 'sales-report-sort-by',
    viewType: ''
  }

  const getComponent = () => screen.getByTestId(attributes.component)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportDateFilters component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportQueryInputs, { propsData })
    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should show and hide "group" and "with" input based on report view type', async () => {
    const propsData = { value: { reportViewType: 'detailed' } }
    const wrapper = renderWithMainApp(SalesReportQueryInputs, { propsData })
    expect(wrapper.queryByTestId(attributes.with)).toBeFalsy()
    expect(wrapper.queryByTestId(attributes.groupBy)).toBeFalsy()

    await wrapper.updateProps({ value: { reportViewType: 'summary' } })
    expect(wrapper.queryByTestId(attributes.with)).toBeTruthy()
    expect(wrapper.queryByTestId(attributes.groupBy)).toBeTruthy()
  })

  it('should emit updated value on any change', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

    const propsData = { value: {} }
    const wrapper = renderWithMainApp(SalesReportQueryInputs, { propsData })

    await fireEvent.click(screen.getByTestId('reports-query-date-filters-last-month'))

    jest.useRealTimers()

    expect(getEmittedEventValue(wrapper, 'params:changed')).toStrictEqual({
      filter: {
        created_at: {
          gte: '2022-12-01',
          lte: '2022-12-31'
        }
      }
    })
  })
})
