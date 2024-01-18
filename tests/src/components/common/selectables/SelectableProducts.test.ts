import '@testing-library/jest-dom'
import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import { setupServer } from 'msw/node'
import SelectableProducts from '@/components/common/selectables/SelectableProducts.vue'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'selectable-products',
  searchProduct: 'selectable-products-search-name',
  filters: 'selectable-products-grid-drawer',
  filterChips: 'selectable-products-filter-chips',
  selectedProducts: 'selectable-products-chips',
  productsGrid: 'selectable-products-grid',
  selectedProductChip: 'deletable-chips-product'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchProduct = () => screen.getByTestId(attributes.searchProduct)
  const getFilters = () => screen.getByTestId(attributes.filters)
  const getFilterChips = () => screen.getByTestId(attributes.filterChips)
  const getSelectedProducts = () => screen.getByTestId(attributes.selectedProducts)
  const getProductsGrid = () => screen.queryByTestId(attributes.productsGrid)
  const getProductsGridLoading = () => screen.queryByText('Loading items...')

  const searchProduct = async (name: string) => {
    await fireEvent.update(getSearchProduct(), name)
  }

  const selectProduct = async (index: number) => {
    const val = await getProductsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedProductName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedProductChip}-${index}`)?.textContent
  }

  return {
    getComponent,
    getSearchProduct,
    getFilters,
    getFilterChips,
    getSelectedProducts,
    getProductsGrid,
    searchProduct,
    selectProduct,
    getProductsGridLoading,
    getSelectedProductName
  }
}

describe('SelectableProducts input component test', () => {
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
  })

  it('should mount SelectableProducts component correctly', async () => {
    renderWithMainApp(SelectableProducts)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple products from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', product_ids: '' }, multiple: true, showChips: true }
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
