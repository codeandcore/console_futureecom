import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableCustomerGroups/utils/fixtures'
import { configure } from '@testing-library/dom'
import { customerGroupFactory } from '~/tests/factories/customers/customerGroupFactories'
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
import SelectableCustomerGroups from '@/components/common/selectables/resources/SelectableCustomerGroups.vue'

describe('SelectableCustomerGroups component test without granted permission to the resource', () => {
  const server: SetupServer = setupServer()

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/customers/groups', (req, res, ctx) => {
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

  it('should mount SelectableCustomerGroups component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableCustomerGroups)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('customer\\group')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display the searchbar with filters, grid and selected elements if not provided', async () => {
    renderWithMainApp(SelectableCustomerGroups)
    const { getFilters, getFilterChips, getCustomerGroupsGrid } = fixtures()

    await new Promise(process.nextTick)

    expect(getFilters()).not.toBeInTheDocument()
    expect(getFilterChips()).not.toBeInTheDocument()
    expect(getCustomerGroupsGrid()).not.toBeInTheDocument()
  })

  it('should not make any call for resource even if the ids are provided', async () => {
    const propsData = { value: { name: 'foo', customer_group: ['1', '2', '3'] }, multiple: true, showChips: true }

    renderWithMainApp(SelectableCustomerGroups, { propsData })

    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('customer\\group')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)

    expect(allRequests).toStrictEqual([])
  })

  it('should display only provided items, but still not making any requests call', async () => {
    const items = [customerGroupFactory(), customerGroupFactory()]
    const propsData = { value: { name: 'foo' }, multiple: true, showChips: true, items }

    renderWithMainApp(SelectableCustomerGroups, { propsData })
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('customer\\group')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)

    await new Promise(process.nextTick)
    const { getSelectedCustomerGroupName } = fixtures()

    expect(allRequests).toStrictEqual([])
    expect(getSelectedCustomerGroupName(0)).toBe(items[0].name)
    expect(getSelectedCustomerGroupName(1)).toBe(items[1].name)
  })
})
