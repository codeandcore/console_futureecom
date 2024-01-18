import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportType from '@/components/domains/reports/queryInputs/SalesReportType.vue'

describe('SalesReportType component test', () => {
  const attribute = {
    buttons: 'sale-report-query-type-buttons',
    singleBtn: 'reports-query-type-button'
  }

  const getInput = () => screen.getByTestId(attribute.buttons)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportSelectType component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportType, { propsData })
    expect(getInput()).toHaveAttribute('data-cy', attribute.buttons)
  })

  it('should emit value from clicked button', async () => {
    const unchanged = {
      filter: { created_at: { gte: '2023-05-01', lte: '2023-05-31' } },
      reportViewType: 'summary'
    }
    const propsData = { value: { ...unchanged } }

    const wrapper = renderWithMainApp(SalesReportType, { propsData })

    const buttons = screen.getAllByTestId(attribute.singleBtn)
    expect(buttons.length).toBe(2)

    await fireEvent.click(buttons[1])

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      reportType: 'items'
    })

    await fireEvent.click(buttons[0])

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      reportType: 'orders'
    })
  })
})
