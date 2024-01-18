import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableTags/utils/fixtures'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { tagFactory } from '~/tests/factories/catalog/tagFactories'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested
mockedCrudChecker({ canRead: computed(() => true) })

import * as crudChecker from '@/composable/useCrudChecker'
import SelectableTags from '@/components/common/selectables/resources/SelectableTags.vue'

describe('SelectableTags component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const tagsGrid = gridFactory(tagFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/tags', (req, res, ctx) => {
        return res(ctx.json(tagsGrid), ctx.status(200))
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

  it('should mount SelectableTags component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableTags)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\tag')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple tags from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', tag_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableTags, { propsData })

    //wait to load tags
    await new Promise(process.nextTick)
    const { selectTag, getSelectedTagName } = fixtures()

    await selectTag(0)
    await selectTag(1)
    await selectTag(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tag_ids: [tagsGrid.data[0].id, tagsGrid.data[1].id, tagsGrid.data[2].id]
    })

    expect(getSelectedTagName(0)).toBe(tagsGrid.data[0].name)
    expect(getSelectedTagName(1)).toBe(tagsGrid.data[1].name)
    expect(getSelectedTagName(2)).toBe(tagsGrid.data[2].name)
    expect(getSelectedTagName(3)).toBe(undefined)
  })

  it('should be able to select single tag from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', tag_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableTags, { propsData })

    //wait to load tags
    await new Promise(process.nextTick)
    const { selectTag, getSelectedTagName } = fixtures()

    await selectTag(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tag_id: tagsGrid.data[0].id
    })

    expect(getSelectedTagName(0)).toBe(tagsGrid.data[0].name)
    expect(getSelectedTagName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', tag_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableTags, { propsData })

    //wait to load tags
    await new Promise(process.nextTick)
    const { selectTag, getSelectedTagName } = fixtures()

    await selectTag(0)
    await selectTag(1)
    await selectTag(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tag_id: tagsGrid.data[2].id
    })

    expect(getSelectedTagName(0)).toBe(tagsGrid.data[2].name)
    expect(getSelectedTagName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableTags, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchTag, getTagsGridLoading } = fixtures()
    expect(getTagsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchTag('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays tags in the chips', async () => {
    renderWithMainApp(SelectableTags, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchTag, getTagsGridLoading } = fixtures()
    expect(getTagsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchTag('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
