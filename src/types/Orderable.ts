import type { Cart } from '@futureecom/futureecom-js/dist/services/cart-service'

export type OrderableSections =
  | 'products'
  | 'shipping'
  | 'payment_method'
  | 'requested_delivery'
  | 'properties'
  | 'customer'
  | 'shipping_address'
  | 'billing_address'
  | 'coupon'
  | 'note'
  | 'purchase_order'

export interface OrderableErrorReasons {
  message: string
  reasons?: {
    [uuid: string]: OrderableErrorProductReasonMessage
  }
  data: Cart
}

export interface OrderableErrorProductReasonMessage {
  message: string
  product_id?: string
  reason?: string
}
