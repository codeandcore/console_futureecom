export type OfflinePaymentMethod = 'bank_transfer' | 'cash_on_delivery' | 'offline'

export type OnlinePaymentMethod =
  | 'braintree'
  | 'cardknox'
  | 'paypal'
  | 'poynt_terminal'
  | 'poynt'
  | 'stripe'
  | 'cardknox_pos'
  | 'converge'
  | 'tranzila'
  | 'heartland'

export type PaymentMethod = OfflinePaymentMethod & OnlinePaymentMethod

export const PaymentMethodCodes: (string | PaymentMethod)[] = [
  'braintree',
  'cardknox',
  'paypal',
  'poynt_terminal',
  'poynt',
  'stripe',
  'bank_transfer',
  'cardknox_pos',
  'converge',
  'tranzila',
  'offline',
  'heartland',
  'cash_on_delivery'
]
