import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SalesReportViewType from '@/components/domains/reports/queryInputs/SalesReportViewType.vue'

describe('SalesReportViewType input component test', () => {
  const attribute = {
    buttons: 'sale-report-query-view-type-buttons',
    singleBtn: 'reports-query-view-type-button'
  }

  const getInput = () => screen.getByTestId(attribute.buttons)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SalesReportViewType component correctly', () => {
    const propsData = { value: {} }
    renderWithMainApp(SalesReportViewType, { propsData })
    expect(getInput()).toHaveAttribute('data-cy', attribute.buttons)
  })

  it('should emit value from clicked button', async () => {
    const unchanged = { filter: { created_at: { gte: '2023-05-01', lte: '2023-05-31' } } }
    const propsData = { value: { ...unchanged, reportViewType: ['summary'] } }

    const wrapper = renderWithMainApp(SalesReportViewType, { propsData })

    const buttons = screen.getAllByTestId(attribute.singleBtn)
    expect(buttons.length).toBe(2)

    await fireEvent.click(buttons[1])

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      reportViewType: 'detailed'
    })

    await fireEvent.click(buttons[0])

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      reportViewType: 'summary'
    })
  })
})
