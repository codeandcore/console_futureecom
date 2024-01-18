import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SwitchField from '@/components/common/SwitchField.vue'

const attributes = {
  component: 'switch-field',
  label: 'switch-field-label',
  toggle: 'switch-field-toggle'
}

export const fixtures = () => {
  const getComponent = () => screen.queryByTestId(attributes.component)
  const getLabel = () => screen.queryByTestId(attributes.label)
  const getToggle = () => screen.queryByTestId(attributes.toggle)
  const toggle = async () => {
    const element = getComponent()
    if (!element) {
      return
    }
    await fireEvent.click(element)
  }

  return {
    getComponent,
    getLabel,
    getToggle,
    toggle
  }
}

describe('SwitchField component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SwitchField component correctly', () => {
    const propsData = { 'data-cy': attributes.component }

    renderWithMainApp(SwitchField, { propsData })

    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
    expect(fixtures().getLabel()).toBeInTheDocument()
    expect(fixtures().getToggle()).toBeInTheDocument()
  })

  it('should emit toggled value by clicking on whole div or on the switch only', async () => {
    const propsData = { 'label': 'foo', 'data-cy': attributes.component }
    const wrapper = renderWithMainApp(SwitchField, { propsData })

    const toggle = fixtures().getToggle()
    const element = fixtures().getComponent()

    expect(toggle && element).toBeTruthy()

    if (!toggle || !element) {
      return
    }

    await fireEvent.click(toggle)
    expect(getEmittedEventValue(wrapper, 'input')).toBeTrue()

    await wrapper.updateProps({ value: true })

    await fireEvent.click(element)
    expect(getEmittedEventValue(wrapper, 'input')).toBeFalse()
  })

  it('should emit toggled value from false to true on click', async () => {
    const propsData = { 'value': false, 'label': 'foo', 'data-cy': attributes.component }
    const wrapper = renderWithMainApp(SwitchField, { propsData })

    await fixtures().toggle()

    expect(getEmittedEventValue(wrapper, 'input')).toBeTrue()
  })

  it('should emit toggled value from true to false on click', async () => {
    const propsData = { 'value': true, 'label': 'foo', 'data-cy': attributes.component }
    const wrapper = renderWithMainApp(SwitchField, { propsData })

    await fixtures().toggle()
    expect(getEmittedEventValue(wrapper, 'input')).toBeFalse()
  })
})
