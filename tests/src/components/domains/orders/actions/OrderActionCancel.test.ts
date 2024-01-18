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
import OrderActionCancel from '@/components/domains/orders/actions/OrderActionCancel.vue'
import waitForExpect from 'wait-for-expect'
import type { SetupServer } from 'msw/node'

const attributes = {
  component: 'order-action-cancel-btn',
  yesBtn: 'order-action-cancel-yes-btn',
  noBtn: 'order-action-cancel-no-btn',
  loadingBtnClass: 'v-btn--loading'
}

const getComponent = () => screen.getByTestId(attributes.component)
const getYesBtnClasses = () => screen.getByTestId(attributes.yesBtn).getAttribute('class')
const isButtonLoading = () => expect(getYesBtnClasses()).toContain(attributes.loadingBtnClass)
const isButtonNotLoading = () => expect(getYesBtnClasses()).not.toContain(attributes.loadingBtnClass)

describe('OrderActionCancel input component test', () => {
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

  it('should mount OrderActionCancel component correctly', () => {
    const propsData = { value: orderFactory() }
    renderWithMainApp(OrderActionCancel, { propsData })
    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should open confirmation dialog with two buttons and close it', async () => {
    const propsData = { value: orderFactory() }
    const { queryByTestId } = renderWithMainApp(OrderActionCancel, { propsData })

    expect(queryByTestId(attributes.noBtn)).toBeFalsy()
    expect(queryByTestId(attributes.yesBtn)).toBeFalsy()

    await fireEvent.click(getComponent())

    const noBtn = screen.getByTestId(attributes.noBtn)
    expect(noBtn).toBeTruthy()
    expect(screen.getByTestId).toBeTruthy()

    await fireEvent.click(noBtn)

    await waitForExpect(() => {
      expect(queryByTestId(attributes.noBtn)).not.toBeInTheDocument()
      expect(queryByTestId(attributes.yesBtn)).not.toBeInTheDocument()
    })
  })

  it('should not emit input event after failed requests, stop loading and trigger error toast', async () => {
    const propsData = { value: orderFactory() }

    const wrapper = renderWithMainApp(OrderActionCancel, { propsData })

    server.use(
      rest.get('/orders/orders/:id', (req, res) => {
        return res.networkError('Failed to connect')
      })
    )

    expect(mockedUseToast.addSuccessToast).not.toHaveBeenCalled()

    await fireEvent.click(getComponent())

    isButtonNotLoading()
    await fireEvent.click(screen.getByTestId(attributes.yesBtn))
    isButtonLoading()

    await waitForExpect(() => {
      const val = getEmittedEventValue(wrapper, 'input')
      expect(val).toBe(undefined)
      expect(mockedUseToast.addSuccessToast).not.toHaveBeenCalled()
      expect(mockedUseToast.addErrorToast).toHaveBeenCalled()
      expect(screen.queryByTestId(attributes.yesBtn)).toBeFalsy()
    })
  })

  it('should emit input event with updated order, trigger success toast and state of loading button after requests ', async () => {
    const propsData = { value: orderFactory() }
    const wrapper = renderWithMainApp(OrderActionCancel, { propsData })

    await fireEvent.click(getComponent())

    isButtonNotLoading()
    await fireEvent.click(screen.getByTestId(attributes.yesBtn))
    isButtonLoading()

    await waitForExpect(() => {
      const val = getEmittedEventValue(wrapper, 'input')
      expect(val).toBeTruthy()
      expect(val.updated_at).toBeTruthy()
      expect(val.updated_at).not.toEqual(propsData.value.updated_at)
      expect(mockedUseToast.addSuccessToast).toHaveBeenCalled()
      expect(mockedUseToast.addErrorToast).not.toHaveBeenCalled()
      expect(screen.queryByTestId(attributes.yesBtn)).toBeFalsy()
    })
  })
})
