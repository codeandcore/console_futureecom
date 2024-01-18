import '@testing-library/jest-dom'
import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { brandFactory } from '~/tests/factories/catalog/brandFactories'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import { setupServer } from 'msw/node'
import SelectableBrands from '@/components/common/selectables/SelectableBrands.vue'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'selectable-brands',
  searchBrand: 'selectable-brands-search-name',
  filters: 'selectable-brands-grid-drawer',
  filterChips: 'selectable-brands-filter-chips',
  selectedProducts: 'selectable-brands-chips',
  brandsGrid: 'selectable-brands-grid',
  selectedBrandChip: 'deletable-chips-brand'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchBrand = () => screen.getByTestId(attributes.searchBrand)
  const getFilters = () => screen.getByTestId(attributes.filters)
  const getFilterChips = () => screen.getByTestId(attributes.filterChips)
  const getSelectedBrands = () => screen.getByTestId(attributes.selectedProducts)
  const getBrandsGrid = () => screen.queryByTestId(attributes.brandsGrid)
  const getBrandsGridLoading = () => screen.queryByText('Loading items...')

  const searchBrand = async (name: string) => {
    await fireEvent.update(getSearchBrand(), name)
  }

  const selectBrand = async (index: number) => {
    const val = await getBrandsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedBrandName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedBrandChip}-${index}`)?.textContent
  }

  return {
    getComponent,
    getSearchBrand,
    getFilters,
    getFilterChips,
    getSelectedBrands,
    getBrandsGrid,
    getBrandsGridLoading,
    searchBrand,
    selectBrand,
    getSelectedBrandName
  }
}

describe('SelectableBrands input component test', () => {
  const server: SetupServer = setupServer()
  const brandsGrid = gridFactory(brandFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/brands', (req, res, ctx) => {
        return res(ctx.json(brandsGrid), ctx.status(200))
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

  it('should mount SelectableBrands component correctly', async () => {
    renderWithMainApp(SelectableBrands)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple brands from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', brand_ids: '' }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableBrands, { propsData })

    //wait to load brands
    await new Promise(process.nextTick)
    const { selectBrand, getSelectedBrandName } = fixtures()

    await selectBrand(0)
    await selectBrand(1)
    await selectBrand(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      brand_ids: [brandsGrid.data[0].id, brandsGrid.data[1].id, brandsGrid.data[2].id]
    })

    expect(getSelectedBrandName(0)).toBe(brandsGrid.data[0].name)
    expect(getSelectedBrandName(1)).toBe(brandsGrid.data[1].name)
    expect(getSelectedBrandName(2)).toBe(brandsGrid.data[2].name)
    expect(getSelectedBrandName(3)).toBe(undefined)
  })

  it('should be able to select single brand from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', brand_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableBrands, { propsData })

    //wait to load brands
    await new Promise(process.nextTick)
    const { selectBrand, getSelectedBrandName } = fixtures()

    await selectBrand(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      brand_id: brandsGrid.data[0].id
    })

    expect(getSelectedBrandName(0)).toBe(brandsGrid.data[0].name)
    expect(getSelectedBrandName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', brand_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableBrands, { propsData })

    //wait to load brands
    await new Promise(process.nextTick)
    const { selectBrand, getSelectedBrandName } = fixtures()

    await selectBrand(0)
    await selectBrand(1)
    await selectBrand(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      brand_id: brandsGrid.data[2].id
    })

    expect(getSelectedBrandName(0)).toBe(brandsGrid.data[2].name)
    expect(getSelectedBrandName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableBrands, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchBrand, getBrandsGridLoading } = fixtures()
    expect(getBrandsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchBrand('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays brands in the chips', async () => {
    renderWithMainApp(SelectableBrands, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchBrand, getBrandsGridLoading } = fixtures()
    expect(getBrandsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchBrand('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
