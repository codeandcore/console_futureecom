import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt, selectItemClass } from '~/tests/helpers/fixtures/selectItemAt'
import SalesReportSortByOption from '@/components/domains/reports/queryInputs/sort/SalesReportSortByOption.vue'

export const attributes = {
  component: 'sales-report-sort-by-option',
  items: 'sales-report-sort-by-option-item',
  selected: 'sales-report-sort-by-option-selection'
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

describe('SalesReportSortByOption input component test', () => {
  const items = [
    '-meta.foo.avg',
    'meta.foo.avg',
    'a.avg.amount',
    'b.min.amount',
    'c.max.amount',
    'd.sum.amount',
    '-a.avg.amount',
    'e',
    'f.g.h'
  ]

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportSortByOption component correctly', () => {
    const propsData = { value: {}, items }
    renderWithMainApp(SalesReportSortByOption, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('formats text options without meta, amount-related values and duplications', async () => {
    const propsData = { value: { option: '' }, items }
    const wrapper = renderWithMainApp(SalesReportSortByOption, { propsData })

    await fixtures().open()
    const optionsToSelect = wrapper.container.querySelectorAll(selectItemClass)

    expect(optionsToSelect.length).toBe(7)

    const optionContents = ['foo', 'a', 'b', 'c', 'd', 'e', 'f g h']
    optionContents.forEach((item, index) => expect(optionsToSelect[index].textContent).toBe(item))
  })

  it('emits selected option without any "-" and "avg/min/max/sum" set in it', async () => {
    const propsData = { value: { option: 'items_count' }, items }
    const wrapper = renderWithMainApp(SalesReportSortByOption, { propsData })

    const optionValues = ['meta.foo', 'a', 'b', 'c', 'd', 'e', 'f.g.h']

    for (const index of optionValues.keys()) {
      await fixtures().selectOption(wrapper.container, index)
      const expected = { option: optionValues[index], total: undefined }
      expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)
    }
  })
})
