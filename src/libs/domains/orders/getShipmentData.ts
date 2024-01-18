import type { OrderShipment, OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'

export default (shipment: OrderShipment): OrderShipmentData => {
  const { carrier, items, notes, to, tracking_number } = shipment

  return {
    carrier,
    items,
    notes,
    to,
    tracking_number
  }
}
