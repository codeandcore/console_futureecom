import '@testing-library/jest-dom'

import { configure, screen } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { fixtures as selectVatFixtures } from '~/tests/src/components/common/selectables/SelectVat.test'
import { setupServer } from 'msw/node'
import { vatFactory } from '~/tests/factories/taxes/taxFactories'
import { vatRatesHandlers } from '~/tests/server/handlers'
import ApplicableVat from '@/components/foundation/ApplicableVat.vue'
import waitForExpect from 'wait-for-expect'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'select-vat'
}

export const fixtures = (vats?: BaseVat[]) => {
  const getComponent = () => screen.queryByTestId(attributes.component)

  return {
    ...selectVatFixtures(vats),
    getComponent
  }
}

describe('ApplicableVat input component test', () => {
  const server: SetupServer = setupServer(...vatRatesHandlers)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  beforeEach(() => server.listen())

  afterEach(() => {
    server.resetHandlers()
    server.events.removeAllListeners('request:start')
    server.events.removeAllListeners('request:match')
    server.events.removeAllListeners('request:unhandled')
    jest.clearAllMocks()
  })

  afterAll(() => server.close())

  it('should mount ApplicableVat component correctly', async () => {
    const propsData = {}
    renderWithMainApp(ApplicableVat, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  // TODO: Figure out how to properly mock computed from composables
  it.skip('should emit selected vat from API without recalculations', async () => {
    server.use(
      rest.get('/taxes/vat', (req, res, ctx) => {
        const context = { override: { data: vatFixtures.getVats() } }
        return res(ctx.json(gridFactory(vatFactory, context)), ctx.status(200))
      })
    )

    const vatFixtures = fixtures()

    const propsData = {}
    const wrapper = renderWithMainApp(ApplicableVat, { propsData })

    await waitForExpect(async () => {
      await vatFixtures.selectVatOption(wrapper.container, vatFixtures.getVats()[0].value)
      expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(vatFixtures.getVats()[0])
      expect(wrapper.emitted()).not.toHaveProperty('update:prices')
      expect(wrapper.emitted()).not.toHaveProperty('recalculate:net')
      expect(wrapper.emitted()).not.toHaveProperty('recalculate:gross')
    })
  })
})
