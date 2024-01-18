import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import MoneyPreview from '@/components/common/MoneyPreview.vue'

export const attributes = {
  component: 'money-preview'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  return {
    getComponent
  }
}

describe('MoneyPreview component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount MoneyPreview component correctly', () => {
    renderWithMainApp(MoneyPreview)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('displays formatted money value', async () => {
    const propsData = { value: { amount: '123', currency: 'USD' } }

    const wrapper = renderWithMainApp(MoneyPreview, { propsData })

    const { getComponent } = fixtures()

    expect(getComponent()).toHaveTextContent('$1.23')
    expect(getComponent()).not.toHaveClass('grey--text')

    await wrapper.updateProps({ value: { amount: '12300', currency: 'USD' } })
    expect(getComponent()).toHaveTextContent('$123.00')
    expect(getComponent()).not.toHaveClass('grey--text')

    await wrapper.updateProps({ value: { amount: '0', currency: 'USD' } })
    expect(getComponent()).toHaveTextContent('$0.00')
    expect(getComponent()).not.toHaveClass('grey--text')

    await wrapper.updateProps({ value: { amount: '0', currency: 'ILS' } })
    expect(getComponent()).toHaveTextContent('₪0.00')
    expect(getComponent()).not.toHaveClass('grey--text')

    await wrapper.updateProps({ value: { amount: '0', currency: 'PLN' } })
    expect(getComponent()).toHaveTextContent('PLN 0.00')
    expect(getComponent()).not.toHaveClass('grey--text')
  })

  it('displays greyed N/A when value is null, undefined or has empty amount', async () => {
    const propsData = { value: null }

    const wrapper = renderWithMainApp(MoneyPreview, { propsData })

    const { getComponent } = fixtures()

    expect(getComponent()).toHaveTextContent('N/A')
    expect(getComponent()).toHaveClass('grey--text')

    await wrapper.updateProps({ value: undefined })

    expect(getComponent()).toHaveTextContent('N/A')
    expect(getComponent()).toHaveClass('grey--text')

    await wrapper.updateProps({ value: { amount: '', currency: 'USD' } })

    expect(getComponent()).toHaveTextContent('N/A')
    expect(getComponent()).toHaveClass('grey--text')
  })
})
