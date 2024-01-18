import '@testing-library/jest-dom'

import { mockedUseToast } from '~/tests/mocks/mockedToasts'

import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { orderFactory } from '~/tests/factories/orders/orderFactories'
import { orderHandlers } from '~/tests/server/handlers'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import OrderActionArchive from '@/components/domains/orders/actions/OrderActionArchive.vue'
import waitForExpect from 'wait-for-expect'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'order-action-archive-btn',
  loadingBtnClass: 'v-btn--loading'
}

const getComponent = () => screen.getByTestId(attributes.component)
const getComponentClasses = () => getComponent().getAttribute('class')
const isButtonLoading = () => expect(getComponentClasses()).toContain(attributes.loadingBtnClass)
const isButtonNotLoading = () => expect(getComponentClasses()).not.toContain(attributes.loadingBtnClass)

describe('OrderActionArchive input component test', () => {
  const server: SetupServer = setupServer(...orderHandlers)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  beforeEach(() => server.listen())

  afterEach(() => {
    server.resetHandlers()
    server.events.removeAllListeners('request:start')
    server.events.removeAllListeners('request:match')
    server.events.removeAllListeners('request:unhandled')
    jest.clearAllMocks()
  })

  afterAll(() => server.close())

  it('should mount OrderActionArchive component correctly', () => {
    const propsData = { value: orderFactory() }
    renderWithMainApp(OrderActionArchive, { propsData })
    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not emit input event after failed requests, stop loading and trigger error toast', async () => {
    const propsData = { value: orderFactory() }

    const wrapper = renderWithMainApp(OrderActionArchive, { propsData })

    server.use(
      rest.get('/orders/orders/:id', (req, res) => {
        return res.networkError('Failed to connect')
      })
    )

    expect(mockedUseToast.addSuccessToast).not.toHaveBeenCalled()

    isButtonNotLoading()
    await fireEvent.click(getComponent())
    isButtonLoading()

    await waitForExpect(() => {
      const val = getEmittedEventValue(wrapper, 'input')
      expect(val).toBe(undefined)
      expect(mockedUseToast.addErrorToast).toHaveBeenCalled()
      isButtonNotLoading()
    })
  })

  it('should emit input event with updated order, trigger success toast and state of loading button after requests ', async () => {
    const propsData = { value: orderFactory() }
    const wrapper = renderWithMainApp(OrderActionArchive, { propsData })

    isButtonNotLoading()

    await fireEvent.click(getComponent())
    isButtonLoading()

    await waitForExpect(() => {
      const val = getEmittedEventValue(wrapper, 'input')
      expect(val).toBeTruthy()
      expect(val.updated_at).toBeTruthy()
      expect(val.updated_at).not.toEqual(propsData.value.updated_at)
      expect(mockedUseToast.addSuccessToast).toHaveBeenCalled()
      expect(mockedUseToast.addErrorToast).not.toHaveBeenCalled()
      isButtonNotLoading()
    })
  })
})
