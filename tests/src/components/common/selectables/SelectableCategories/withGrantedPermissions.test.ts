import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableCategories/utils/fixtures'
import { categoryFactory } from '~/tests/factories/catalog/categoryFactories'
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
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'

describe('SelectableCategories component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const categoriesGrid = gridFactory(categoryFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/categories', (req, res, ctx) => {
        return res(ctx.json(categoriesGrid), ctx.status(200))
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

  it('should mount SelectableCategories component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableCategories)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\category')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple categories from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', category_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableCategories, { propsData })

    //wait to load categories
    await new Promise(process.nextTick)
    const { selectCategory, getSelectedCategoryName } = fixtures()

    await selectCategory(0)
    await selectCategory(1)
    await selectCategory(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      category_ids: [categoriesGrid.data[0].id, categoriesGrid.data[1].id, categoriesGrid.data[2].id]
    })

    expect(getSelectedCategoryName(0)).toBe(categoriesGrid.data[0].name)
    expect(getSelectedCategoryName(1)).toBe(categoriesGrid.data[1].name)
    expect(getSelectedCategoryName(2)).toBe(categoriesGrid.data[2].name)
    expect(getSelectedCategoryName(3)).toBe(undefined)
  })

  it('should be able to select single category from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', category_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableCategories, { propsData })

    //wait to load categories
    await new Promise(process.nextTick)
    const { selectCategory, getSelectedCategoryName } = fixtures()

    await selectCategory(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      category_id: categoriesGrid.data[0].id
    })

    expect(getSelectedCategoryName(0)).toBe(categoriesGrid.data[0].name)
    expect(getSelectedCategoryName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', category_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableCategories, { propsData })

    //wait to load categories
    await new Promise(process.nextTick)
    const { selectCategory, getSelectedCategoryName } = fixtures()

    await selectCategory(0)
    await selectCategory(1)
    await selectCategory(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      category_id: categoriesGrid.data[2].id
    })

    expect(getSelectedCategoryName(0)).toBe(categoriesGrid.data[2].name)
    expect(getSelectedCategoryName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableCategories, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchCategory, getCategoriesGridLoading } = fixtures()
    expect(getCategoriesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchCategory('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays categories in the chips', async () => {
    renderWithMainApp(SelectableCategories, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchCategory, getCategoriesGridLoading } = fixtures()
    expect(getCategoriesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchCategory('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
