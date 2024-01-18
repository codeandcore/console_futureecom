import '@testing-library/jest-dom'
import { fixtures as SwitchFieldFixtures } from '~/tests/src/components/common/SwitchField.test'
import { configure, screen } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import ClientDefault from '@/components/domains/auth/clients/ClientDefault.vue'

export const attributes = {
  component: 'switch-field'
}

export const fixtures = () => {
  return {
    ...SwitchFieldFixtures(),
    getComponent: async () => screen.getByTestId(attributes.component)
  }
}

describe('ClientDefault input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount ClientDefault component correctly', async () => {
    const propsData = { value: { providers: [] } }
    renderWithMainApp(ClientDefault, { propsData })
    expect(await fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should re-emit selected items from SwitchField component', async () => {
    const propsData = { value: { default: undefined } }
    const wrapper = renderWithMainApp(ClientDefault, { propsData })

    await fixtures().toggle()

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ default: true })
  })
})
