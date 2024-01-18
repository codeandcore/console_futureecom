import '@testing-library/jest-dom'

import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import SalesReportSortByDirection from '@/components/domains/reports/queryInputs/sort/SalesReportSortByDirection.vue'

export const attributes = {
  component: 'sales-report-sort-by-direction',
  items: 'sales-report-sort-by-direction-item',
  selected: 'sales-report-sort-by-direction-selection'
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
describe('SalesReportSortByDirection input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportSortByDirection component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportSortByDirection, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('emits ascending option as empty string', async () => {
    const propsData = { value: { option: 'quantity' } }
    const wrapper = renderWithMainApp(SalesReportSortByDirection, { propsData })

    await fixtures().selectOption(wrapper.container, 0)

    const expected = { option: 'quantity', direction: '' }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })

  it('emits descending option as "-"', async () => {
    const propsData = { value: { option: 'items_count' } }
    const wrapper = renderWithMainApp(SalesReportSortByDirection, { propsData })

    await fixtures().selectOption(wrapper.container, 1)

    const expected = { option: 'items_count', direction: '-' }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
  })
})
