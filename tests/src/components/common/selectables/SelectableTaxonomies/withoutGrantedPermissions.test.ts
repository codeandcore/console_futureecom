import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableTaxonomies/utils/fixtures'
import { configure } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { setupServer } from 'msw/node'
import { taxonomyFactory } from '~/tests/factories/catalog/taxonomyFactories'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

import { computed } from '@vue/composition-api'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested (not globally accessible)
mockedCrudChecker({ canRead: computed(() => false) })

import * as crudChecker from '@/composable/useCrudChecker'
import { rest } from 'msw'
import SelectableTaxonomies from '@/components/common/selectables/resources/SelectableTaxonomies.vue'

describe('SelectableTaxonomies component test without granted permission to the resource', () => {
  const server: SetupServer = setupServer()

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/catalog/taxonomy', (req, res, ctx) => {
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

  it('should mount SelectableTaxonomies component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableTaxonomies)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\taxonomy')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display the searchbar with filters, grid and selected elements if not provided', async () => {
    renderWithMainApp(SelectableTaxonomies)
    const { getFilters, getFilterChips, getTaxonomiesGrid } = fixtures()

    await new Promise(process.nextTick)

    expect(getFilters()).not.toBeInTheDocument()
    expect(getFilterChips()).not.toBeInTheDocument()
    expect(getTaxonomiesGrid()).not.toBeInTheDocument()
  })

  it('should not make any call for resource even if the ids are provided', async () => {
    const propsData = { value: { name: 'foo', taxonomy_ids: ['1', '2', '3'] }, multiple: true, showChips: true }

    renderWithMainApp(SelectableTaxonomies, { propsData })

    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\taxonomy')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    expect(allRequests).toStrictEqual([])
  })

  it('should display only provided items, but still not making any requests call', async () => {
    const items = [taxonomyFactory(), taxonomyFactory()]
    const propsData = { value: { name: 'foo' }, multiple: true, showChips: true, items }

    renderWithMainApp(SelectableTaxonomies, { propsData })
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('catalog\\taxonomy')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)
    const { getSelectedTaxonomyName } = fixtures()

    expect(allRequests).toStrictEqual([])
    expect(getSelectedTaxonomyName(0)).toBe(items[0].name)
    expect(getSelectedTaxonomyName(1)).toBe(items[1].name)
  })
})
