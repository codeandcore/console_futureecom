import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableTaxonomies/utils/fixtures'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { taxonomyFactory } from '~/tests/factories/catalog/taxonomyFactories'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested
mockedCrudChecker({ canRead: computed(() => true) })

import * as crudChecker from '@/composable/useCrudChecker'
import SelectableTaxonomies from '@/components/common/selectables/resources/SelectableTaxonomies.vue'

describe('SelectableTaxonomies component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const taxonomiesGrid = gridFactory(taxonomyFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/taxonomy', (req, res, ctx) => {
        return res(ctx.json(taxonomiesGrid), ctx.status(200))
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

  it('should mount SelectableTaxonomies component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableTaxonomies)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\taxonomy')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple taxonomies from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', taxonomy_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableTaxonomies, { propsData })

    //wait to load taxonomies
    await new Promise(process.nextTick)
    const { selectTaxonomy, getSelectedTaxonomyName } = fixtures()

    await selectTaxonomy(0)
    await selectTaxonomy(1)
    await selectTaxonomy(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      taxonomy_ids: [taxonomiesGrid.data[0].id, taxonomiesGrid.data[1].id, taxonomiesGrid.data[2].id]
    })

    expect(getSelectedTaxonomyName(0)).toBe(taxonomiesGrid.data[0].name)
    expect(getSelectedTaxonomyName(1)).toBe(taxonomiesGrid.data[1].name)
    expect(getSelectedTaxonomyName(2)).toBe(taxonomiesGrid.data[2].name)
    expect(getSelectedTaxonomyName(3)).toBe(undefined)
  })

  it('should be able to select single taxonomy from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', taxonomy_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableTaxonomies, { propsData })

    //wait to load taxonomies
    await new Promise(process.nextTick)
    const { selectTaxonomy, getSelectedTaxonomyName } = fixtures()

    await selectTaxonomy(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      taxonomy_id: taxonomiesGrid.data[0].id
    })

    expect(getSelectedTaxonomyName(0)).toBe(taxonomiesGrid.data[0].name)
    expect(getSelectedTaxonomyName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', taxonomy_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableTaxonomies, { propsData })

    //wait to load taxonomies
    await new Promise(process.nextTick)
    const { selectTaxonomy, getSelectedTaxonomyName } = fixtures()

    await selectTaxonomy(0)
    await selectTaxonomy(1)
    await selectTaxonomy(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      taxonomy_id: taxonomiesGrid.data[2].id
    })

    expect(getSelectedTaxonomyName(0)).toBe(taxonomiesGrid.data[2].name)
    expect(getSelectedTaxonomyName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableTaxonomies, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchTaxonomy, getTaxonomiesGridLoading } = fixtures()
    expect(getTaxonomiesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchTaxonomy('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays taxonomies in the chips', async () => {
    renderWithMainApp(SelectableTaxonomies, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchTaxonomy, getTaxonomiesGridLoading } = fixtures()
    expect(getTaxonomiesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchTaxonomy('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
