import '~/tests/configs/vue-composition-api-config.ts'

import '@testing-library/jest-dom'
import * as SalesReportSortByDirectionTests from '~/tests/src/components/domains/report/queryInputs/sort/SalesReportSortByDirection.test'
import * as SalesReportSortByOption from '~/tests/src/components/domains/report/queryInputs/sort/SalesReportSortByOption.test'
import * as SalesReportSortByTotalsTests from '~/tests/src/components/domains/report/queryInputs/sort/SalesReportSortByTotals.test'
import { configure, screen } from '@testing-library/dom'
import { getElemErrorMessage } from '~/tests/helpers/fixtures/getElemErrorMessage'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportSortByInputs from '@/components/domains/reports/queryInputs/SalesReportSortByInputs.vue'

const attributes = {
  component: 'sales-report-sort-by',
  sortByInputOption: 'sales-report-sort-by-input-option',
  sortByInputTotals: 'sales-report-sort-by-input-totals',
  sortByInputDirection: 'sales-report-sort-by-input-direction',
  attributesSortByDirection: SalesReportSortByDirectionTests.attributes,
  attributesSortByOption: SalesReportSortByOption.attributes,
  attributesSortByTotals: SalesReportSortByTotalsTests.attributes
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getInputOption = () => screen.getByTestId(attributes.sortByInputOption)
  const getInputTotals = () => screen.getByTestId(attributes.sortByInputTotals)
  const getInputDirection = () => screen.getByTestId(attributes.sortByInputDirection)

  return {
    getComponent,
    getInputOption,
    getInputTotals,
    getInputDirection,
    fixturesSortByOption: SalesReportSortByOption.fixtures(),
    fixturesSortByTotals: SalesReportSortByTotalsTests.fixtures(),
    fixturesSortByDirection: SalesReportSortByDirectionTests.fixtures()
  }
}

describe('SalesReportSortBy input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportSortBy component correctly', () => {
    const items = ['billing_country', '-created_at']

    const propsData = { value: {}, items }
    renderWithMainApp(SalesReportSortByInputs, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('renders sort by inputs for detailed report view types without totals', () => {
    const propsData = { value: { reportViewType: 'detailed' }, items: [] }
    renderWithMainApp(SalesReportSortByInputs, { propsData })

    expect(screen.queryByTestId(attributes.attributesSortByOption.component)).toBeInTheDocument()
    expect(screen.queryByTestId(attributes.attributesSortByTotals.component)).not.toBeInTheDocument()
    expect(screen.queryByTestId(attributes.attributesSortByDirection.component)).toBeInTheDocument()
  })

  it('renders sort by inputs for summary report view types with totals', () => {
    const propsData = { value: { reportViewType: 'summary' }, items: [] }
    renderWithMainApp(SalesReportSortByInputs, { propsData })

    expect(screen.queryByTestId(attributes.attributesSortByOption.component)).toBeInTheDocument()
    expect(screen.queryByTestId(attributes.attributesSortByTotals.component)).toBeInTheDocument()
    expect(screen.queryByTestId(attributes.attributesSortByDirection.component)).toBeInTheDocument()
  })

  it('does not emit anything without filled all fields and displays an error', async () => {
    const propsData = {
      value: { reportViewType: 'summary', sort: [] },
      items: ['-meta.foo.avg.amount', 'meta.foo.avg.amount']
    }

    const wrapper = renderWithMainApp(SalesReportSortByInputs, { propsData })
    await fixtures().fixturesSortByOption.selectOption(wrapper.container, 0)
    expect(getEmittedEventValue(wrapper, 'input')).toBe(undefined)
    expect(getElemErrorMessage(fixtures().getInputTotals())).toBe('Value can not be empty')
  })

  it('makes possible to select totals when options are already selected and emit stringified sort', async () => {
    const propsData = {
      value: { reportViewType: 'summary', sort: [] },
      items: ['-meta.foo.avg.amount', 'meta.foo.avg.amount']
    }

    const wrapper = renderWithMainApp(SalesReportSortByInputs, { propsData })

    await fixtures().fixturesSortByOption.selectOption(wrapper.container, 0)

    await fixtures().fixturesSortByTotals.selectOption(wrapper.container, 1)

    const expected = {
      sort: ['meta.foo.avg.amount'],
      reportViewType: 'summary'
    }

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })
})
