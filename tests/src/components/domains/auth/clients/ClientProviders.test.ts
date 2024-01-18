import '@testing-library/jest-dom'
import { UserType } from '@futureecom/futureecom-js/dist/services/auth-service'
import { configure, screen } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { fixtures as selectProvidersFixtures } from '~/tests/src/components/common/selectables/SelectProvider.test'
import ClientProviders from '@/components/domains/auth/clients/ClientProviders.vue'

export const attributes = {
  component: 'client-input-providers'
}

export const fixtures = () => {
  return {
    getComponent: async () => screen.getByTestId(attributes.component)
  }
}

describe('ClientProviders input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount ClientProviders component correctly', async () => {
    const propsData = { value: { providers: [] } }
    renderWithMainApp(ClientProviders, { propsData })
    expect(await fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should re-emit selected items from SelectProvider component', async () => {
    const propsData = { value: { providers: [] } }
    const wrapper = renderWithMainApp(ClientProviders, { propsData })

    await selectProvidersFixtures().selectUserTypeOption(wrapper.container, UserType.GUEST, UserType.CUSTOMER)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ providers: ['guest', 'customer'] })
  })
})
