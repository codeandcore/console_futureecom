import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableCustomerGroups/utils/fixtures'
import { configure } from '@testing-library/dom'
import { customerGroupFactory } from '~/tests/factories/customers/customerGroupFactories'
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
import SelectableCustomerGroups from '@/components/common/selectables/resources/SelectableCustomerGroups.vue'

describe('SelectableCustomerGroups component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const customerGroupsGrid = gridFactory(customerGroupFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/customers/groups', (req, res, ctx) => {
        return res(ctx.json(customerGroupsGrid), ctx.status(200))
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

  it('should be able to select multiple customerGroups from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', customer_group: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableCustomerGroups, { propsData })

    //wait to load customerGroups
    await new Promise(process.nextTick)
    const { selectCustomerGroup, getSelectedCustomerGroupName } = fixtures()

    await selectCustomerGroup(0)
    await selectCustomerGroup(1)
    await selectCustomerGroup(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      customer_group: [
        customerGroupsGrid.data[0].code,
        customerGroupsGrid.data[1].code,
        customerGroupsGrid.data[2].code
      ]
    })

    expect(getSelectedCustomerGroupName(0)).toBe(customerGroupsGrid.data[0].name)
    expect(getSelectedCustomerGroupName(1)).toBe(customerGroupsGrid.data[1].name)
    expect(getSelectedCustomerGroupName(2)).toBe(customerGroupsGrid.data[2].name)
    expect(getSelectedCustomerGroupName(3)).toBe(undefined)
  })

  it('should be able to select single customerGroup from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', customer_group: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableCustomerGroups, { propsData })

    //wait to load customerGroups
    await new Promise(process.nextTick)
    const { selectCustomerGroup, getSelectedCustomerGroupName } = fixtures()

    await selectCustomerGroup(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      customer_group: customerGroupsGrid.data[0].code
    })

    expect(getSelectedCustomerGroupName(0)).toBe(customerGroupsGrid.data[0].name)
    expect(getSelectedCustomerGroupName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', customer_group: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableCustomerGroups, { propsData })

    //wait to load customerGroups
    await new Promise(process.nextTick)
    const { selectCustomerGroup, getSelectedCustomerGroupName } = fixtures()

    await selectCustomerGroup(0)
    await selectCustomerGroup(1)
    await selectCustomerGroup(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      customer_group: customerGroupsGrid.data[2].code
    })

    expect(getSelectedCustomerGroupName(0)).toBe(customerGroupsGrid.data[2].name)
    expect(getSelectedCustomerGroupName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableCustomerGroups, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchCustomerGroup, getCustomerGroupsGridLoading } = fixtures()
    expect(getCustomerGroupsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchCustomerGroup('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays customerGroups in the chips', async () => {
    renderWithMainApp(SelectableCustomerGroups, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchCustomerGroup, getCustomerGroupsGridLoading } = fixtures()
    expect(getCustomerGroupsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchCustomerGroup('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
