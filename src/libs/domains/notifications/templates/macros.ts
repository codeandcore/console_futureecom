export type NotificationTemplateMacrosCode =
  | 'client.credentials'
  | 'order.confirmation'
  | 'order.refund'
  | 'payment.confirmation'
  | 'quote.availability'
  | 'shipment.confirmation'
  | 'user.confirmation'
  | 'password.reset'
  | 'user.created'
  | 'user.password.generate'

export type NotificationTemplateMacroAttribute = string | Record<string, string[]>
export type NotificationTemplateMacro = {
  [key in NotificationTemplateMacrosCode]: NotificationTemplateMacroAttribute[]
}

const macros: NotificationTemplateMacro = {
  'client.credentials': [
    { clients: ['type', 'client_id', 'client_secret'] },
    { receivers: ['email', 'name'] },
    'type',
    'name',
    'user_name',
    { 'admin.email': [] },
    { 'admin.password': [] }
  ],
  'order.confirmation': [
    'summary.total_items_count',
    'summary.total_items_amount',
    'summary.total_new_items_amount',
    'summary.total_shipping',
    'summary.total_new_shipping',
    'summary.total_discount',
    'summary.total_items_discount',
    'summary.total_shipping_discount',
    'summary.total_taxes',
    'summary.total_items_taxes',
    'summary.total_shipping_taxes',
    'summary.total_paid',
    'summary.total_refunded',
    'summary.total_due',
    'shipping.method',
    'shipping.name',
    'shipping.price.amount',
    'shipping.price.currency',
    'shipping.type',
    'shipping.price_type',
    'payment.method',
    'payment.name',
    'payment.type',
    'number',
    'vat_in_price',
    'discount_after_tax',
    'tax_type',
    'shipping_address.given_name',
    'shipping_address.family_name',
    'shipping_address.organization',
    'shipping_address.locality',
    'shipping_address.address_line1',
    'shipping_address.postal_code',
    'shipping_address.country_code',
    'shipping_address.administrative_area',
    'shipping_address.telephone',
    'shipping_address.country',
    'billing_address.given_name',
    'billing_address.family_name',
    'billing_address.organization',
    'billing_address.locality',
    'billing_address.address_line1',
    'billing_address.postal_code',
    'billing_address.country_code',
    'billing_address.administrative_area',
    'billing_address.telephone',
    'billing_address.country',
    'customer.customer_id',
    'customer.firstname',
    'customer.lastname',
    'customer.email',
    { 'customer.telephone.number': [] },
    'discounts_in_price',
    { items: ['name', 'quantity', 'image_url', 'total'] }
  ],
  'order.refund': ['order_number', 'amount', 'customer.firstname', 'customer.lastname'],
  'payment.confirmation': [
    'amount',
    'customer.firstname',
    'customer.lastname',
    'customer.email',
    'id',
    'provider',
    { reference_id: [] },
    'status',
    'type',
    'payment_type',
    { created_at: [] },
    'order_number'
  ],
  'quote.availability': [
    'status',
    'status_before',
    'customer.customer_id',
    'customer.firstname',
    'customer.lastname',
    'customer.email',
    { 'customer.telephone.number': [] },
    'url'
  ],
  'shipment.confirmation': [
    'carrier',
    'tracking_number',
    'notes',
    { items: ['item_id', 'quantity'] },
    'order_number',
    'updated_at',
    'created_at',
    'customer.customer_id',
    'customer.firstname',
    'customer.lastname',
    'customer.email',
    { 'customer.telephone.number': [] }
  ],
  'user.confirmation': ['firstname', 'lastname', 'telephone.prefix', 'telephone.number', 'dob', 'email', 'created_at'],
  'password.reset': ['name', 'resetLink'],
  'user.created': ['name', 'password'],
  'user.password.generate': ['name', 'password']
}

export const hasMatchingMacrosCode = (code: string): code is NotificationTemplateMacrosCode => {
  return code in macros
}

export const getMacrosAttributes = (
  templateCode: NotificationTemplateMacrosCode
): NotificationTemplateMacroAttribute[] => {
  return [...macros[templateCode]]
}

export const getMacroWrapper = (code: string) => `{{${code}}}`
export const getMacroIfConditionWrapper = (code: string) => `{{#${code}}}\n\t{{${code}}}\n{{/${code}}}`
export const getMacroElseConditionWrapper = (code: string) => `{{^${code}}}\n\n{{/${code}}}`

export const getMacroItemsLoopWrapper = (key: string, values: string[]) => {
  const mapped = values.map((val) => `\t{{${val}}}`).join('\n')
  const mappedWrapper = mapped ? `\n${mapped}\n` : `\n`
  return `{{${key}}}${mappedWrapper}{{/${key}}}`
}

export const canPutIfCondition = (value: string[]): boolean => {
  return Boolean(!value.length)
}

export const getFormattedMacro = (code: NotificationTemplateMacroAttribute, includeElse = false): string => {
  if (typeof code === 'string') {
    return getMacroWrapper(code)
  }

  const values = Object.entries<string[]>(code)
  if (values && !values.length) {
    return ''
  }

  const [nestedCode, nestedValue] = values[0]

  if (nestedValue.length) {
    return getMacroItemsLoopWrapper(nestedCode, nestedValue)
  }

  const ifValue = getMacroIfConditionWrapper(nestedCode)
  const elseValue = includeElse ? getMacroElseConditionWrapper(nestedCode) : ''

  return elseValue ? `${ifValue}\n${elseValue}` : ifValue
}
