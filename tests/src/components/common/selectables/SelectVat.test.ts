import '@testing-library/jest-dom'
import { BaseVatRateFactory, vatFactory } from '~/tests/factories/taxes/taxFactories'
import { configure, screen } from '@testing-library/dom'
import { faker } from '@faker-js/faker'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { selectItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import { setupServer } from 'msw/node'
import { vatRatesHandlers } from '~/tests/server/handlers'
import SelectVat from '@/components/common/selectables/SelectVat.vue'
import waitForExpect from 'wait-for-expect'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'select-vat'
}

export const fixtures = (vats?: BaseVat[]) => {
  const options = vats || faker.helpers.multiple(BaseVatRateFactory, { count: 10 })

  const getComponent = () => screen.queryByTestId(attributes.component)

  const getVats = () => options

  const selectVatOption = async (container: Element, value: number) => {
    const elem = getComponent()

    if (!elem) {
      return
    }

    await fireEvent.click(elem)

    const index = options.findIndex((option) => option.value === value)
    if (index >= 0) {
      await selectItemAt(container, index)
    }
  }

  return {
    getVats,
    getComponent,
    selectVatOption
  }
}

describe('SelectVat input component test', () => {
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

  it('should mount SelectVat component correctly', async () => {
    const propsData = {}
    renderWithMainApp(SelectVat, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should emit selected vat from API', async () => {
    server.use(
      rest.get('/taxes/vat', (req, res, ctx) => {
        const context = { override: { data: vatFixtures.getVats() } }
        return res(ctx.json(gridFactory(vatFactory, context)), ctx.status(200))
      })
    )

    const vatFixtures = fixtures()

    const propsData = {}
    const wrapper = renderWithMainApp(SelectVat, { propsData })

    await waitForExpect(async () => {
      await vatFixtures.selectVatOption(wrapper.container, vatFixtures.getVats()[0].value)
      expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(vatFixtures.getVats()[0])
    })
  })

  it('should emit selected vat from given options', async () => {
    const vatFixtures = fixtures()

    const propsData = { items: vatFixtures.getVats() }
    const wrapper = renderWithMainApp(SelectVat, { propsData })

    await vatFixtures.selectVatOption(wrapper.container, vatFixtures.getVats()[0].value)
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(vatFixtures.getVats()[0])
  })
})
