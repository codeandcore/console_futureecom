export default {
  '{0} - {1} of {2}': '{0} - {1} of {2}',
  '{0} unread notifications': '{0} unread notifications',
  'Mark order {0} as paid': 'Mark order {0} as paid',
  'Refund order {0}': 'Refund order {0}',
  '{0} per item': '{0} per item',
  'Shipped by {0}': '',
  '{0} in stock': '{0} in stock',
  'Used {0} times': 'Used {0} times',
  '{0} saved': '{0} saved',
  '{0} deleted': '{0} deleted',
  'approved': 'Approved',
  'placed': 'Placed',
  'processing': 'Processing',
  'shipped': 'Shipped',
  'refunded': 'Refunded',
  'on_hold': 'On hold',
  'canceled': 'Canceled',
  'completed': 'Completed',
  'created': 'Created',
  'partially_shipped': 'Partially shipped',
  '{0} items': '{0} items',
  'general.settings.timezone':
    'The Global field is used as default timezone. The Console, PoS and Backend fields, when set, will take precedence over Global in the respective apps.',
  'general.settings.checkout.requesting_delivery':
    'With the requested delivery enabled, the system will let customer choose when he would want his order to arrive.',
  'general.settings.checkout.enforced_delivery':
    'With the delivery enforced (when it is enabled), the store admin will be hinted about requested delivery and that the shipping time approaches.',
  'general.settings.checkout.delivery_interval':
    'The time interval is meant to specify at what minutes the delivery can be requested, like at every 15 or every 30.',
  'general.settings.checkout.blackouts':
    'The blackout settings are going to specify what dates, days or hours should not be available for selection by customer.',
  'general.settings.checkout.delivery_window':
    'The delivery window specifies how soon the admin should be alerted about the requested delivery date approaching.',
  'general.settings.locale': 'Locale is being used for dates and currency formatting.',
  'general.settings.language':
    'Default language determines in what language base attributes of products, shipping methods and others are defined.',
  'general.settings.language.change':
    'Changing default language to different one will not swap translations for all entities on the store. This change will only determine in what language current attributes are defined leaving them always as default.',
  'general.settings.language.change.example':
    'For example, when original default language was set to English and it will be changed to Spanish, all the entities will remain with base attributes in English and will require to be changed to Spanish.',
  'order.transaction.void':
    'Payment can usually be voided up to 24 hours after payment is made (may vary depending on payment provider).',
  'product.variant.update':
    'Updates Variations based on Options changes, without re-creating unaffected Variations. Will not add and generate new Variant set.',
  'product.variant.generate':
    'Regardless of the changes in Variants, it will always re-create all the Variations based on current Variants options.',
  'general.settings.taxes.discount_after':
    'The "Discount After Tax" switch determines whether the discount should be applied to the subtotal after taxes have been added to the subtotal.',
  'general.settings.taxes.vat_in_price':
    'The "VAT in Price" switch determines whether the product price already has VAT included, or whether the system needs to add the VAT to it.',
  'general.settings.taxes.shipping_type':
    'The "Ignore Shipping Type" switch determines whether the taxes should take into account of what type shipping method is. When this switch is enabled, shipping method type will be ignored and tax calculation will be based on the source setting. When this switch is not enabled, then any order with shipping of "Pick Up" type will get its taxes calculated based on "origin" (store address), not the destination (shipping address).',
  'general.settings.taxes.destination_source':
    '"destination" uses shipping address to calculate taxes. If the shipping type for the order is pickup, then use the store address.',
  'store.wizard.custom.domain':
    'A URL will automatically be generated if a custom domain is not provided. A custom URL can be added in the future.'
}
