import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableProducts/utils/fixtures'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested
mockedCrudChecker({ canRead: computed(() => true) })

import * as crudChecker from '@/composable/useCrudChecker'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'

describe('SelectableProducts component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const productsGrid = gridFactory(productFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/products', (req, res, ctx) => {
        return res(ctx.json(productsGrid), ctx.status(200))
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

  it('should be able to select multiple products from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', product_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableProducts, { propsData })

    //wait to load products
    await new Promise(process.nextTick)
    const { selectProduct, getSelectedProductName } = fixtures()

    await selectProduct(0)
    await selectProduct(1)
    await selectProduct(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      product_ids: [productsGrid.data[0].id, productsGrid.data[1].id, productsGrid.data[2].id]
    })

    expect(getSelectedProductName(0)).toBe(productsGrid.data[0].name)
    expect(getSelectedProductName(1)).toBe(productsGrid.data[1].name)
    expect(getSelectedProductName(2)).toBe(productsGrid.data[2].name)
    expect(getSelectedProductName(3)).toBe(undefined)
  })

  it('should be able to select single product from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', product_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableProducts, { propsData })

    //wait to load products
    await new Promise(process.nextTick)
    const { selectProduct, getSelectedProductName } = fixtures()

    await selectProduct(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      product_id: productsGrid.data[0].id
    })

    expect(getSelectedProductName(0)).toBe(productsGrid.data[0].name)
    expect(getSelectedProductName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', product_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableProducts, { propsData })

    //wait to load products
    await new Promise(process.nextTick)
    const { selectProduct, getSelectedProductName } = fixtures()

    await selectProduct(0)
    await selectProduct(1)
    await selectProduct(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      product_id: productsGrid.data[2].id
    })

    expect(getSelectedProductName(0)).toBe(productsGrid.data[2].name)
    expect(getSelectedProductName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableProducts, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchProduct, getProductsGridLoading } = fixtures()
    expect(getProductsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchProduct('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays products in the chips', async () => {
    renderWithMainApp(SelectableProducts, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchProduct, getProductsGridLoading } = fixtures()
    expect(getProductsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchProduct('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
