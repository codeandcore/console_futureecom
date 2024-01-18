import { orderFactory, orderShipmentFactory } from '~/tests/factories/orders/orderFactories'
import getShipmentData from '@/libs/domains/orders/getShipmentData'

describe('getShipmentData util tests', () => {
  it('extracts shipment data from order', () => {
    const shipment = orderShipmentFactory()

    const order = orderFactory({ override: { shipments: [shipment] } })
    const val = getShipmentData(order.shipments[0])

    expect(val.carrier).toStrictEqual(order.shipments[0].carrier)
    expect(val.items).toStrictEqual(order.shipments[0].items)
    expect(val.notes).toStrictEqual(order.shipments[0].notes)
    expect(val.to).toStrictEqual(order.shipments[0].to)
    expect(val.tracking_number).toStrictEqual(order.shipments[0].tracking_number)
    expect(val.comment_visible_for_customer).toStrictEqual(undefined)
  })
})
