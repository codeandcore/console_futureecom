import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableCategories/utils/fixtures'
import { categoryFactory } from '~/tests/factories/catalog/categoryFactories'
import { configure } from '@testing-library/dom'
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
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'

describe('SelectableCategories component test without granted permission to the resource', () => {
  const server: SetupServer = setupServer()

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/categories', (req, res, ctx) => {
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

  it('should mount SelectableCategories component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableCategories)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\category')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display the searchbar with filters, grid and selected elements if not provided', async () => {
    renderWithMainApp(SelectableCategories)
    const { getFilters, getFilterChips, getCategoriesGrid } = fixtures()

    await new Promise(process.nextTick)

    expect(getFilters()).not.toBeInTheDocument()
    expect(getFilterChips()).not.toBeInTheDocument()
    expect(getCategoriesGrid()).not.toBeInTheDocument()
  })

  it('should not make any call for resource even if the ids are provided', async () => {
    const propsData = { value: { name: 'foo', category_ids: ['1', '2', '3'] }, multiple: true, showChips: true }

    renderWithMainApp(SelectableCategories, { propsData })

    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\category')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    expect(allRequests).toStrictEqual([])
  })

  it('should display only provided items, but still not making any requests call', async () => {
    const items = [categoryFactory(), categoryFactory()]
    const propsData = { value: { name: 'foo' }, multiple: true, showChips: true, items }

    renderWithMainApp(SelectableCategories, { propsData })
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\category')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)
    const { getSelectedCategoryName } = fixtures()

    expect(allRequests).toStrictEqual([])
    expect(getSelectedCategoryName(0)).toBe(items[0].name)
    expect(getSelectedCategoryName(1)).toBe(items[1].name)
  })
})
