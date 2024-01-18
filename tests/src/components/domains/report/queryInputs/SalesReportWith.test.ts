import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportWith from '@/components/domains/reports/queryInputs/SalesReportWith.vue'

describe('SalesReportWith input component test', () => {
  const attribute = 'sales-report-with'

  const getInput = () => screen.getByTestId(attribute)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportWith component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportWith, { propsData })
    expect(getInput()).toHaveAttribute('data-cy', attribute)
  })

  it('should bind value to checkbox and emit deleted value on re-check value', async () => {
    const unchanged = {
      filter: { created_at: { gte: '2023-05-01', lte: '2023-05-31' } },
      sort: ['meta.total_discount.avg.amount'],
      with: undefined
    }

    const propsData = { value: { ...unchanged } }

    const wrapper = await renderWithMainApp(SalesReportWith, { propsData })
    const input = getInput()

    await fireEvent.click(input)
    const expected = { ...unchanged, with: ['deleted'] }
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(expected)

    await wrapper.updateProps({ value: expected })

    await fireEvent.click(input)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      with: undefined
    })
  })
})
