import mitt from 'mitt'
import type { OrderableErrorReasons } from '@/types/Orderable'

export type OrderableEvent = {
  'orderable-error': {
    status: number
    data?: OrderableErrorReasons
    toastMessage?: string
  }
}

export const orderableEventBus = mitt<OrderableEvent>()

export const emitOrderableError = (err: XMLHttpRequest, toastMessage: string) => {
  const { status, data } = err.response
  orderableEventBus.emit('orderable-error', { status, data, toastMessage })
}
