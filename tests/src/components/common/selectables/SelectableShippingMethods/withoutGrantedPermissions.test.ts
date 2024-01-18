import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import {
  attributes,
  fixtures
} from '~/tests/src/components/common/selectables/SelectableShippingMethods/utils/fixtures'
import { configure } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { setupServer } from 'msw/node'
import { shippingMethodFactory } from '~/tests/factories/cart/shippingMethodFactory'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested (not globally accessible)
mockedCrudChecker({ canRead: computed(() => false) })

import * as crudChecker from '@/composable/useCrudChecker'
import { rest } from 'msw'
import SelectableShippingMethods from '@/components/common/selectables/resources/SelectableShippingMethods.vue'

describe('SelectableShippingMethods component test without granted permission to the resource', () => {
  const server: SetupServer = setupServer()

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/cart/shippings', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200))
      })
    )
  })

  beforeEach(() => {
    allRequests = []
    server.listen()
    server.events.on('request:start', (req) => allRequests.push(req))
  })

  afterAll(() => {
    server.resetHandlers()
    server.events.removeAllListeners('request:start')
    server.events.removeAllListeners('request:match')
    server.events.removeAllListeners('request:unhandled')
    jest.resetAllMocks()
  })

  it('should mount SelectableShippingMethods component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableShippingMethods)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('cart\\shipping')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display the searchbar with filters, grid and selected elements if not provided', async () => {
    renderWithMainApp(SelectableShippingMethods)
    const { getFilters, getFilterChips, getShippingMethodsGrid } = fixtures()

    await new Promise(process.nextTick)

    expect(getFilters()).not.toBeInTheDocument()
    expect(getFilterChips()).not.toBeInTheDocument()
    expect(getShippingMethodsGrid()).not.toBeInTheDocument()
  })

  it('should not make any call for resource even if the ids are provided', async () => {
    const propsData = { value: { name: 'foo', shipping_method_ids: ['1', '2', '3'] }, multiple: true, showChips: true }

    renderWithMainApp(SelectableShippingMethods, { propsData })

    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('cart\\shipping')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    expect(allRequests).toStrictEqual([])
  })

  it('should display only provided items, but still not making any requests call', async () => {
    const items = [shippingMethodFactory(), shippingMethodFactory()]
    const propsData = { value: { name: 'foo' }, multiple: true, showChips: true, items }

    renderWithMainApp(SelectableShippingMethods, { propsData })
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('cart\\shipping')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    const { getSelectedShippingMethodName } = fixtures()

    expect(allRequests).toStrictEqual([])
    expect(getSelectedShippingMethodName(0)).toBe(items[0].name)
    expect(getSelectedShippingMethodName(1)).toBe(items[1].name)
  })
})
