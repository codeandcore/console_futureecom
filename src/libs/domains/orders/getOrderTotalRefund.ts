import Big from 'big.js'
import type { Money } from '@futureecom/futureecom-js'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { OrderRefundRequest } from '@futureecom/futureecom-js/dist/services/order-service'

export default (order: Pick<Order, 'shipping' | 'items'>, selectedRefund: OrderRefundRequest): Money => {
  const { currency: shippingCurrency, amount: shippingAmount } = order.shipping?.total || { currency: '', amount: 0 }

  if (!(selectedRefund.items || []).length && !selectedRefund.shipping) {
    return { amount: 0, currency: shippingCurrency }
  }

  const totalItemsRefund = (selectedRefund.items || [])
    .reduce((prev, current) => {
      const orderItem = order.items.find((orderItem) => orderItem.id === current.item_id)
      if (!orderItem) {
        return prev
      }
      const multipleItemsAmount = new Big(orderItem.real_price.amount).mul(current.quantity)
      return prev.add(multipleItemsAmount)
    }, new Big(0))
    .toString()

  const initRefund = new Big(selectedRefund.shipping ? shippingAmount : 0)
  const refundedItems = initRefund.add(totalItemsRefund)

  return { amount: refundedItems.toString(), currency: shippingCurrency }
}
