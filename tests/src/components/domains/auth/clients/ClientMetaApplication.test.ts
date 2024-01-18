import '@testing-library/jest-dom'
import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { configure, screen } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { fixtures as selectApplicationFixtures } from '~/tests/src/components/common/selectables/SelectApplication.test'
import ClientMetaApplication from '@/components/domains/auth/clients/ClientMetaApplication.vue'

export const attributes = {
  component: 'select-application'
}

export const fixtures = () => {
  return {
    ...selectApplicationFixtures(),
    getComponent: async () => screen.getByTestId(attributes.component)
  }
}

describe('ClientMetaApplication input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount ClientMetaApplication component correctly', async () => {
    const propsData = { value: { providers: [] } }
    renderWithMainApp(ClientMetaApplication, { propsData })
    expect(await fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it("should re-emit selected last item from SelectApplication without changing other meta's fields", async () => {
    const unchanged = { foo: 'bar' }
    const propsData = { value: { meta: { application: [], ...unchanged } } }
    const wrapper = renderWithMainApp(ClientMetaApplication, { propsData })

    await selectApplicationFixtures().selectApplicationOption(
      wrapper.container,
      ApplicationType.CONSOLE,
      ApplicationType.STOREFRONT
    )

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      meta: {
        application: 'storefront',
        ...unchanged
      }
    })
  })
})
