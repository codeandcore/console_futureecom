import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableBrands/utils/fixtures'
import { brandFactory } from '~/tests/factories/catalog/brandFactories'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
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
import SelectableBrands from '@/components/common/selectables/resources/SelectableBrands.vue'

describe('SelectableBrands component test with granted permission to the resource', () => {
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
    jest.resetAllMocks()
  })

  it('should mount SelectableBrands component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableBrands)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\brand')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple brands from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', brand_ids: [] }, multiple: true, showChips: true }
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
