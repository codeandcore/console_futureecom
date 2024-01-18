import '@testing-library/jest-dom'
import '~/tests/configs/vue-composition-api-config'

import * as filterChips from '~/tests/src/components/tables/filters/FilterChips.test'
import { attributes, fixtures } from '~/tests/src/components/common/selectables/SelectableSaleTaxes/utils/fixtures'
import { computed } from '@vue/composition-api'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { gridFactory } from '~/tests/factories/collectionFactory'
import { mockedCrudChecker } from '~/tests/mocks/mockedCrudChecker'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { taxRateFactory } from '~/tests/factories/taxes/taxFactories'
import type { MockedRequest } from 'msw'
import type { SetupServer } from 'msw/node'

//TODO: in the future, mock tokens instead, once they are encapsulated and tested
mockedCrudChecker({ canRead: computed(() => true) })

import * as crudChecker from '@/composable/useCrudChecker'
import SelectableSaleTaxes from '@/components/common/selectables/resources/SelectableSaleTaxes.vue'

describe('SelectableSaleTaxes component test with granted permission to the resource', () => {
  const server: SetupServer = setupServer()
  const saleTaxesGrid = gridFactory(taxRateFactory)

  let allRequests: MockedRequest[]

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    server.use(
      rest.get('/taxes/rates', (req, res, ctx) => {
        return res(ctx.json(saleTaxesGrid), ctx.status(200))
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

  it('should mount SelectableSaleTaxes component correctly and call proper permissions', async () => {
    renderWithMainApp(SelectableSaleTaxes)
    expect(crudChecker.useCrudChecker).toHaveBeenCalledWith('taxes\\taxrate')
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should be able to select multiple saleTaxes from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', tax_rate_ids: [] }, multiple: true, showChips: true }
    const wrapper = renderWithMainApp(SelectableSaleTaxes, { propsData })

    //wait to load saleTaxes
    await new Promise(process.nextTick)
    const { selectSaleTax, getSelectedSaleTaxName, transformToChipText } = fixtures()

    await selectSaleTax(0)
    await selectSaleTax(1)
    await selectSaleTax(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tax_rate_ids: [saleTaxesGrid.data[0].id, saleTaxesGrid.data[1].id, saleTaxesGrid.data[2].id]
    })

    expect(getSelectedSaleTaxName(0)).toBe(`${transformToChipText(saleTaxesGrid.data[0])}`)
    expect(getSelectedSaleTaxName(1)).toBe(`${transformToChipText(saleTaxesGrid.data[1])}`)
    expect(getSelectedSaleTaxName(2)).toBe(`${transformToChipText(saleTaxesGrid.data[2])}`)
    expect(getSelectedSaleTaxName(3)).toBe(undefined)
  })

  it('should be able to select single customerGroup from the grid and display it in the chips', async () => {
    const propsData = { value: { name: 'foo', tax_rate_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableSaleTaxes, { propsData })

    //wait to load saleTaxes
    await new Promise(process.nextTick)
    const { selectSaleTax, getSelectedSaleTaxName, transformToChipText } = fixtures()

    await selectSaleTax(0)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tax_rate_id: saleTaxesGrid.data[0].id
    })

    expect(getSelectedSaleTaxName(0)).toBe(transformToChipText(saleTaxesGrid.data[0]))
    expect(getSelectedSaleTaxName(1)).toBe(undefined)
  })

  it('should pick last selected element from the list and display only this one in selected chips', async () => {
    const propsData = { value: { name: 'foo', tax_rate_id: '' }, multiple: false, showChips: true }
    const wrapper = renderWithMainApp(SelectableSaleTaxes, { propsData })

    //wait to load saleTaxes
    await new Promise(process.nextTick)
    const { selectSaleTax, getSelectedSaleTaxName, transformToChipText } = fixtures()

    await selectSaleTax(0)
    await selectSaleTax(1)
    await selectSaleTax(2)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      name: 'foo',
      tax_rate_id: saleTaxesGrid.data[2].id
    })

    expect(getSelectedSaleTaxName(0)).toBe(transformToChipText(saleTaxesGrid.data[2]))
    expect(getSelectedSaleTaxName(1)).toBe(undefined)
  })

  it('puts search value, makes request with name filter and does not show the search chip in filters', async () => {
    renderWithMainApp(SelectableSaleTaxes, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchSaleTax, getSaleTaxesGridLoading } = fixtures()
    expect(getSaleTaxesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchSaleTax('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })

  it('fetches given ids and displays saleTaxes in the chips', async () => {
    renderWithMainApp(SelectableSaleTaxes, { propsData: { 'show-chips': true } })

    await new Promise(process.nextTick)
    const { searchSaleTax, getSaleTaxesGridLoading } = fixtures()
    expect(getSaleTaxesGridLoading()).not.toBeInTheDocument()

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe(null)

    jest.useFakeTimers()
    await searchSaleTax('name')

    jest.advanceTimersByTime(1000)
    jest.useRealTimers()

    await new Promise(process.nextTick)

    expect(allRequests.at(-1)?.url.searchParams.get('filter[name]')).toBe('name')

    expect(filterChips.fixtures().getFilterLabel('name')).toBe(null)
  })
})
