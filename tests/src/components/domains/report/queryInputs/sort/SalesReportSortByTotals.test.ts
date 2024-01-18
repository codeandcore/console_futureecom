import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import SalesReportSortByTotals from '@/components/domains/reports/queryInputs/sort/SalesReportSortByTotals.vue'

export const attributes = {
  component: 'sales-report-sort-by-totals',
  items: 'sales-report-sort-by-totals-item',
  selected: 'sales-report-sort-by-totals-selection'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  const open = async () => await fireEvent.click(getComponent())

  const selectOption = async (container: Element, index: number) => {
    await open()
    await selectItemAt(container, index)
  }

  return {
    getComponent,
    open,
    selectOption
  }
}
describe('SalesReportSortByTotals input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportSortByTotals component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportSortByTotals, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('emits value without amount suffix for option value "meta.quantity"', async () => {
    const propsData = { value: { option: 'meta.quantity' } }
    const wrapper = renderWithMainApp(SalesReportSortByTotals, { propsData })

    await fixtures().selectOption(wrapper.container, 0)

    const expected = { option: 'meta.quantity', total: 'avg' }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })

  it('emits value without amount suffix for option value "meta.items_count"', async () => {
    const propsData = { value: { option: 'meta.items_count' } }
    const wrapper = renderWithMainApp(SalesReportSortByTotals, { propsData })

    await fixtures().selectOption(wrapper.container, 0)

    const expected = { option: 'meta.items_count', total: 'avg' }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })

  it('emits value with amount suffix for any other option value', async () => {
    const propsData = { value: { option: '' } }
    const wrapper = renderWithMainApp(SalesReportSortByTotals, { propsData })

    await fixtures().selectOption(wrapper.container, 0)

    const expected = { option: '', total: 'avg.amount' }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })
})
