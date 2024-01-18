import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import {
  attributes,
  fixtures
} from '~/tests/src/components/common/selectables/SelectableShippingMethods/utils/fixtures'
import { computed } from '@vue/composition-api'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { shippingMethodFactory } from '~/tests/factories/cart/shippingMethodFactory'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested
mockedCrudChecker({ canRead: computed(() => true) })

import * as crudChecker from '@/composable/useCrudChecker'
import SelectableShippingMethods from '@/components/common/selectables/resources/SelectableShippingMethods.vue'

describe('SelectableShippingMethods component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const shippingMethodsGrid = gridFactory(shippingMethodFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/cart/shippings', (req, res, ctx) => {
        return res(ctx.json(shippingMethodsGrid), ctx.status(200))
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

  it('should mount SelectableShippingMethods component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableShippingMethods)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('cart\\shipping')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple shippingMethods from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', shipping_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableShippingMethods, { propsData })

    //wait to load shippingMethods
    await new Promise(process.nextTick)
    const { selectShippingMethod, getSelectedShippingMethodName } = fixtures()

    await selectShippingMethod(0)
    await selectShippingMethod(1)
    await selectShippingMethod(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      shipping_ids: [shippingMethodsGrid.data[0].id, shippingMethodsGrid.data[1].id, shippingMethodsGrid.data[2].id]
    })

    expect(getSelectedShippingMethodName(0)).toBe(`${shippingMethodsGrid.data[0].name}`)
    expect(getSelectedShippingMethodName(1)).toBe(`${shippingMethodsGrid.data[1].name}`)
    expect(getSelectedShippingMethodName(2)).toBe(`${shippingMethodsGrid.data[2].name}`)
    expect(getSelectedShippingMethodName(3)).toBe(undefined)
  })

  it('should be able to select single customerGroup from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', shipping_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableShippingMethods, { propsData })

    //wait to load shippingMethods
    await new Promise(process.nextTick)
    const { selectShippingMethod, getSelectedShippingMethodName } = fixtures()

    await selectShippingMethod(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      shipping_id: shippingMethodsGrid.data[0].id
    })

    expect(getSelectedShippingMethodName(0)).toBe(shippingMethodsGrid.data[0].name)
    expect(getSelectedShippingMethodName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', shipping_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableShippingMethods, { propsData })

    //wait to load shippingMethods
    await new Promise(process.nextTick)
    const { selectShippingMethod, getSelectedShippingMethodName } = fixtures()

    await selectShippingMethod(0)
    await selectShippingMethod(1)
    await selectShippingMethod(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      shipping_id: shippingMethodsGrid.data[2].id
    })

    expect(getSelectedShippingMethodName(0)).toBe(shippingMethodsGrid.data[2].name)
    expect(getSelectedShippingMethodName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableShippingMethods, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchShippingMethod, getShippingMethodsGridLoading } = fixtures()
    expect(getShippingMethodsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchShippingMethod('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays shippingMethods in the chips', async () => {
    renderWithMainApp(SelectableShippingMethods, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchShippingMethod, getShippingMethodsGridLoading } = fixtures()
    expect(getShippingMethodsGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchShippingMethod('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
