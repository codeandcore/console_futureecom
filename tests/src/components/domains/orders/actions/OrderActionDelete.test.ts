import { attributes, fixtures } from '~/tests/src/components/common/actions/DeleteButtonAction.test'
import { configure } from '@testing-library/dom'
import { getEmittedEventValue, hasEmittedEvent } from '~/tests/helpers/getEmittedEventValue'
import { mockedUseToast } from '~/tests/mocks/mockedToasts'
import { orderFactory } from '~/tests/factories/orders/orderFactories'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import type { SetupServer } from 'msw/node'

location.replace('http://localhost')

import OrderActionDelete from '@/components/domains/orders/actions/OrderActionDelete.vue'

describe('OrderActionDelete component test', () => {
  const server: SetupServer = setupServer()

  beforeEach(() => server.listen())

  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    userEvent.setup()
  })

  afterEach(() => {
    server.resetHandlers()
    server.events.removeAllListeners('request:start')
    server.events.removeAllListeners('request:match')
    server.events.removeAllListeners('request:unhandled')
  })

  afterAll(() => jest.clearAllMocks())

  it('should mount OrderActionDelete component correctly', () => {
    renderWithMainApp(OrderActionDelete)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should submit request on accept click button, emit success event and trigger success toast', async () => {
    const propsData = { value: orderFactory() }
    const wrapper = renderWithMainApp(OrderActionDelete, { propsData })

    server.use(rest.delete('/orders/orders/:id', (req, res, ctx) => res(ctx.status(200))))

    const { openDialog, accept } = fixtures()

    await openDialog()
    const action = accept()

    expect(getEmittedEventValue(wrapper, 'update:loading')).toBeTrue()

    await action
    await new Promise(process.nextTick)

    expect(getEmittedEventValue(wrapper, 'update:loading')).toBeFalse()
    expect(hasEmittedEvent(wrapper, 'success')).toBeTrue()
    expect(mockedUseToast.addSuccessToast).toBeCalledWith('Deleted order')
  })

  it('should emit error event and trigger error toast', async () => {
    const propsData = { value: orderFactory() }
    const wrapper = renderWithMainApp(OrderActionDelete, { propsData })

    const errorMsg = 'Failed to connect'

    server.use(
      rest.delete('/orders/orders/:id', (req, res, ctx) => {
        return res(ctx.text(errorMsg), ctx.status(400))
      })
    )

    const { openDialog, accept } = fixtures()

    await openDialog()
    const action = accept()

    expect(getEmittedEventValue(wrapper, 'update:loading')).toBeTrue()

    await action
    await new Promise(process.nextTick)

    expect(getEmittedEventValue(wrapper, 'update:loading')).toBeFalse()
    expect(getEmittedEventValue(wrapper, 'error')).toStrictEqual(errorMsg)
    expect(mockedUseToast.addErrorToast).toBeCalledWith('Unable to delete order')
  })
})
