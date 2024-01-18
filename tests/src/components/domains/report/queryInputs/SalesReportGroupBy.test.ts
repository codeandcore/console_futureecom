import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportGroupBy from '@/components/domains/reports/queryInputs/SalesReportGroupBy.vue'

describe('SalesReportGroupBy input component test', () => {
  const attribute = 'sales-report-group-by'
  const selectedOptionClass = '.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.primary--text'
  const availableOptionClass = '.v-list-item.v-list-item--link.theme--light'
  const inputValuesClass = '.v-select__selection.v-select__selection--comma'
  const options = [
    { text: 'customer firstname', value: 'customer_firstname' },
    { text: 'billing country', value: 'billing_country' },
    { text: 'billing region', value: 'billing_region' },
    { text: 'created at', value: 'created_at' },
    { text: 'created by', value: 'created_by' }
  ]

  const getInput = () => screen.getByTestId(attribute)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportGroupBy component correctly', () => {
    const propsData = { value: {}, options }
    renderWithMainApp(SalesReportGroupBy, { propsData })
    expect(getInput()).toHaveAttribute('data-cy', attribute)
  })

  it('should bind value to input, open dropdown, emit selected multiple elements and update input with selected values', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

    const unchanged = { filter: { 'items.name': 'foo' } }
    const propsData = { value: { ...unchanged, group: ['customer_firstname'] }, options }

    const wrapper = renderWithMainApp(SalesReportGroupBy, { propsData })

    const initBoundValues = wrapper.container.querySelectorAll(inputValuesClass)
    expect(initBoundValues.length).toEqual(1)
    expect(initBoundValues[0].textContent).toEqual('customer firstname')

    await fireEvent.click(getInput())
    const availableOptionElements = wrapper.container.querySelectorAll(availableOptionClass)

    await fireEvent.click(availableOptionElements[1])
    await fireEvent.click(availableOptionElements[2])
    await fireEvent.click(availableOptionElements[3])
    await fireEvent.click(availableOptionElements[4])

    const selectedOptions = wrapper.container.querySelectorAll(selectedOptionClass)
    expect(selectedOptions.length).toEqual(5)

    jest.advanceTimersByTime(800)
    jest.useRealTimers()

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      group: ['customer_firstname', 'billing_country', 'billing_region', 'created_at', 'created_by']
    })

    const boundValuesToInput = wrapper.container.querySelectorAll(inputValuesClass)
    expect(boundValuesToInput.length).toEqual(selectedOptions.length)

    const inputValues = ['customer firstname, ', 'billing country, ', 'billing region, ', 'created at, ', 'created by']
    inputValues.forEach((item, index) => {
      expect(boundValuesToInput[index].textContent).toBe(item)
    })
  })

  it('should return "null" group on unchecking all group options', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

    const unchanged = {
      filter: { created_at: { gte: '2023-05-01', lte: '2023-05-31' } },
      with: ['data', 'deleted'],
      sort: ['meta.total_discount.avg.amount']
    }
    const propsData = {
      value: { ...unchanged, group: ['customer_firstname'] },
      options
    }

    const wrapper = renderWithMainApp(SalesReportGroupBy, { propsData })
    await fireEvent.click(getInput())

    const selectedOptions = wrapper.container.querySelectorAll(selectedOptionClass)
    await fireEvent.click(selectedOptions[0])

    jest.advanceTimersByTime(800)
    jest.useRealTimers()

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      group: null
    })
  })
})
