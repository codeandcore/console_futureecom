import type {
  Orderable,
  OrderableCheckout,
  OrderableCustomerDetails,
  OrderableGuestDetails
} from '@futureecom/futureecom-js/dist/services/cart-service'

export const hasAddress = (cart: Partial<Orderable>, addressType: 'shipping_address' | 'billing_address') => {
  return !!cart[addressType] && !Array.isArray(cart[addressType])
}

export const isGuest = (val: Orderable['customer']): val is OrderableGuestDetails => 'guest_id' in val
export const isCustomer = (val: Orderable['customer']): val is OrderableCustomerDetails => 'customer_id' in val

export const getCheckoutCustomer = (item: Partial<Orderable>): OrderableCheckout['customer'] => {
  if (!item.customer) {
    return undefined
  }

  if (!isGuest(item.customer)) {
    return undefined
  }

  const { firstname, lastname, email, dob } = item.customer
  return firstname && lastname && email ? { firstname, lastname, email, dob: dob || undefined } : undefined
}
