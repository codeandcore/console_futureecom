import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableProducts/utils/fixtures'
import { configure } from '@testing-library/dom'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { setupServer } from 'msw/node'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested (not globally accessible)
mockedCrudChecker({ canRead: computed(() => false) })

import * as crudChecker from '@/composable/useCrudChecker'
import { rest } from 'msw'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'

describe('SelectableProducts component test without granted permission to the resource', () => {
  const server: SetupServer = setupServer()

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/products', (req, res, ctx) => {
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

  it('should mount SelectableProducts component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableProducts)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\product')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display the searchbar with filters, grid and selected elements if not provided', async () => {
    renderWithMainApp(SelectableProducts)
    const { getFilters, getFilterChips, getProductsGrid } = fixtures()

    await new Promise(process.nextTick)

    expect(getFilters()).not.toBeInTheDocument()
    expect(getFilterChips()).not.toBeInTheDocument()
    expect(getProductsGrid()).not.toBeInTheDocument()
  })

  it('should not make any call for resource even if the ids are provided', async () => {
    const propsData = { value: { name: 'foo', product_ids: ['1', '2', '3'] }, multiple: true, showChips: true }

    renderWithMainApp(SelectableProducts, { propsData })

    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\product')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    expect(allRequests).toStrictEqual([])
  })

  it('should display only provided items, but still not making any requests call', async () => {
    const items = [productFactory(), productFactory()]
    const propsData = { value: { name: 'foo' }, multiple: true, showChips: true, items }

    renderWithMainApp(SelectableProducts, { propsData })
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\product')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)
    const { getSelectedProductName } = fixtures()

    expect(allRequests).toStrictEqual([])
    expect(getSelectedProductName(0)).toBe(items[0].name)
    expect(getSelectedProductName(1)).toBe(items[1].name)
  })
})
