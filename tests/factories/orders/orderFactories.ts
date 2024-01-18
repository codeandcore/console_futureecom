import {
  OrderDocumentICountDocumentStatus,
  OrderDocumentType,
  OrderItemStatus,
  OrderStatus
} from '@futureecom/futureecom-js/dist/services/order-service'
import { ProductClassification, ProductType } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { ShippingPriceType, ShippingType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { createdByFactory } from '~/tests/factories/createdByFactories'
import { faker } from '@faker-js/faker'
import { fakerUtils } from '~/tests/factories/helpers/locale'
import { moneyFactory } from '~/tests/factories/moneyFactories'
import { taxFactory } from '~/tests/factories/taxes/taxFactories'
import { telephoneFactory } from '~/tests/factories/telephoneFactory'
import { transactionFactory } from '~/tests/factories/payment/transactionFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { Discount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type {
  Order,
  OrderAddress,
  OrderComment,
  OrderCustomer,
  OrderCustomerGroup,
  OrderDocument,
  OrderDocumentICountDocument,
  OrderDocumentICountFail,
  OrderDocumentICountSuccess,
  OrderItem,
  OrderItemProperty,
  OrderPayment,
  OrderShipment,
  OrderShipmentItemResponse,
  OrderShipping,
  OrderSummary,
  OrderTransaction,
  OrderValidation
} from '@futureecom/futureecom-js/dist/services/order-service'

export const orderFactory = (context?: FactoryContext<Order>): Order => {
  return {
    organisation: faker.number.int(),
    store: faker.number.int(),
    status_before: faker.helpers.enumValue(OrderStatus),
    discount_after_tax: faker.datatype.boolean(),
    tax_type: faker.helpers.arrayElement(['sales', 'vat']),
    vat_in_price: faker.datatype.boolean(),
    requested_delivery: valueOrNull(faker.date.future().toISOString()),
    id: faker.string.uuid(),
    taxes: faker.helpers.multiple(() => taxFactory(), countOptions),
    purchase_order: faker.phone.imei(),
    note: faker.lorem.words(),
    billing_address: orderAddressFactory(),
    customer: orderCustomerFactory(),
    shipping_address: orderAddressFactory(),
    created_by: createdByFactory(),
    status: faker.helpers.enumValue(OrderStatus),
    number: faker.phone.imei(),
    transactions: faker.helpers.multiple(() => orderTransactionFactory(), countOptions),
    summary: orderSummaryFactory(),
    shipping: orderShippingFactory(),
    validations: faker.helpers.multiple(() => orderValidationFactory(), countOptions),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    payment: orderPaymentFactory(),
    comments: faker.helpers.multiple(() => orderCommentFactory(), countOptions),
    shipments: faker.helpers.multiple(() => orderShipmentFactory(), countOptions),
    items: faker.helpers.multiple(() => orderItemFactory(), countOptions),
    documents: faker.helpers.multiple(() => orderDocumentFactory(), countOptions),
    resolved_at: faker.date.past().toISOString(),
    icount: faker.helpers.maybe(() => faker.helpers.multiple(() => orderICountDocumentsFactory(), countOptions)),
    ...context?.override
  }
}

export const orderCommentFactory = (context?: FactoryContext<OrderComment>): OrderComment => {
  return {
    key: faker.lorem.slug(),
    text: faker.lorem.words(10),
    status: faker.helpers.enumValue(OrderStatus),
    created_at: faker.helpers.maybe(() => faker.date.past().toString()),
    created_by: faker.helpers.maybe(() => faker.person.fullName()),
    visible_for_customer: faker.datatype.boolean(),
    ...context?.override
  }
}

export const orderSummaryFactory = (context?: FactoryContext<OrderSummary>): OrderSummary => {
  return {
    total_items_count: faker.number.int(countOptions.count),
    total_items_amount: moneyFactory(),
    total_new_items_amount: moneyFactory(),
    total_shipping: moneyFactory(),
    total_new_shipping: moneyFactory(),
    total_discount: moneyFactory(),
    total_shipping_discount: moneyFactory(),
    total_items_discount: moneyFactory(),
    total_taxes: moneyFactory(),
    total_shipping_taxes: moneyFactory(),
    total_items_taxes: moneyFactory(),
    total_due: moneyFactory(),
    total_paid: moneyFactory(),
    total_refunded: moneyFactory(),
    ...context?.override
  }
}

export const orderValidationFactory = (context?: FactoryContext<OrderValidation>): OrderValidation => {
  return {
    id: faker.string.uuid(),
    type: faker.lorem.word(),
    name: faker.person.fullName(),
    status: faker.helpers.arrayElement(['failed', 'passed', 'unchecked']),
    comment: faker.lorem.words(15),
    ...context?.override
  }
}

export const orderAddressFactory = (context?: FactoryContext<OrderAddress>): OrderAddress => {
  return {
    country_code: faker.location.countryCode(),
    administrative_area: faker.location.state(),
    locality: faker.location.city(),
    postal_code: faker.location.zipCode(),
    address_line1: faker.location.secondaryAddress(),
    organization: faker.company.name(),
    given_name: faker.person.firstName(),
    family_name: faker.person.lastName(),
    locale: fakerUtils.locale(),
    telephone: telephoneFactory(),
    country: faker.location.country(),
    ...context?.override
  }
}

export const orderCustomerFactory = (context?: FactoryContext<OrderCustomer>): OrderCustomer => {
  return {
    groups: faker.helpers.multiple(() => orderCustomerGroupFactory(), countOptions),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    dob: faker.date.past().toString(),
    email: faker.internet.email(),
    customer_id: faker.string.uuid(),
    ...context?.override
  }
}

export const orderCustomerGroupFactory = (context?: FactoryContext<OrderCustomerGroup>): OrderCustomerGroup => {
  return {
    code: faker.lorem.slug(3),
    name: faker.lorem.words(3),
    id: faker.string.uuid(),
    ...context?.override
  }
}

export const orderShippingFactory = (context?: FactoryContext<OrderShipping>): OrderShipping => {
  return {
    method: faker.lorem.slug(3),
    name: faker.lorem.word(3),
    price: moneyFactory(),
    subtotal: moneyFactory(),
    total: moneyFactory(),
    total_discount: moneyFactory(),
    total_taxes: moneyFactory(),
    refunded: faker.datatype.boolean(),
    type: faker.helpers.arrayElement<ShippingType>([ShippingType.DELIVERY, ShippingType.PICKUP]),
    price_type: faker.helpers.arrayElement([ShippingPriceType.FIXED, ShippingPriceType.PER_ITEM]),
    discounts: faker.helpers.multiple(() => discountFactory(), countOptions),
    taxes: faker.helpers.multiple(() => taxFactory(), countOptions),
    ...context?.override
  }
}

export const discountFactory = (context?: FactoryContext<Discount>): Discount => {
  return {
    code: valueOrNull(faker.lorem.word(3)),
    discount: moneyFactory(),
    discount_type: faker.helpers.arrayElement(['catalog', 'coupon']),
    name: faker.lorem.words(3),
    rate: faker.number.float({ min: 0, max: 1, precision: 2 }),
    rate_type: faker.helpers.arrayElement(['distributed', 'fixed', 'percentage']),
    ...context?.override
  }
}

export const orderPaymentFactory = (context?: FactoryContext<OrderPayment>): OrderPayment => {
  return {
    method: faker.helpers.arrayElement(['bank_transfer', 'paypal', 'braintree', 'cardknox', 'cash']),
    name: faker.helpers.arrayElement(['Bank Transfer', 'Paypal', 'Braintree', 'Cardknox', 'Cash']),
    type: faker.helpers.arrayElement(['offline', 'online']),
    auto_pay: faker.datatype.boolean(),
    ...context?.override
  }
}

export const orderICountDocumentsFactory = (): OrderDocumentICountDocument => {
  const failedDocument: OrderDocumentICountFail = {
    reference_number: faker.phone.imei(),
    reference_type: faker.helpers.arrayElement(['receipt', 'invoice']),
    errors: faker.helpers.maybe(() => faker.helpers.multiple(() => faker.lorem.sentence(), countOptions)),
    message: 'Failed to issue the iCount document',
    status: faker.helpers.arrayElement([
      OrderDocumentICountDocumentStatus.ERROR,
      OrderDocumentICountDocumentStatus.WARNING
    ])
  }
  const successDocument: OrderDocumentICountSuccess = {
    reference_number: faker.phone.imei(),
    reference_type: faker.helpers.arrayElement(['receipt', 'invoice']),
    docnum: faker.number.int({ min: 0, max: 3000 }).toString(),
    link: faker.internet.url(),
    id: faker.string.uuid(),
    status: OrderDocumentICountDocumentStatus.SUCCESS
  }

  return faker.datatype.boolean() ? successDocument : failedDocument
}

export const orderItemPropertiesFactory = (context?: FactoryContext<OrderItemProperty>): OrderItemProperty => {
  return {
    key: faker.string.uuid(),
    name: faker.lorem.words(3),
    value: faker.lorem.slug(3),
    ...context?.override
  }
}

export const orderItemFactory = (context?: FactoryContext<OrderItem>): OrderItem => {
  return {
    properties: faker.helpers.maybe(() => faker.helpers.multiple(() => orderItemPropertiesFactory(), countOptions)),
    quantity_refunded: faker.number.int(),
    quantity_restocked: faker.number.int(),
    status: faker.helpers.arrayElement([
      OrderItemStatus.PARTIALLY_SHIPPED,
      OrderItemStatus.PROCESSING,
      OrderItemStatus.SHIPPED
    ]),
    total_taxes: moneyFactory(),
    total_discount: moneyFactory(),
    total: moneyFactory(),
    subtotal: moneyFactory(),
    product_id: faker.string.uuid(),
    quantity: faker.number.int(),
    id: faker.string.uuid(),
    classification: faker.helpers.arrayElement([ProductClassification.BUNDLE, ProductClassification.COMMON]),
    name: faker.lorem.words(4),
    sku: faker.lorem.slug(4),
    type: faker.helpers.arrayElement([ProductType.DIGITAL, ProductType.PHYSICAL, ProductType.VIRTUAL]),
    brand: faker.lorem.word(),
    image_url: faker.image.url(),
    taxonomy: faker.number.int(),
    translations: valueOrNull({}),
    discounts: faker.helpers.multiple(() => discountFactory(), countOptions),
    taxes: faker.helpers.multiple(() => taxFactory(), countOptions),
    price: moneyFactory(),
    sale_price: moneyFactory(),
    gross_price: moneyFactory(),
    gross_sale_price: moneyFactory(),
    real_price: moneyFactory(),
    tax_rate: faker.number.float({ min: 0, max: 1, precision: 2 }),
    ...context?.override
  }
}

export const orderShipmentFactory = (context?: FactoryContext<OrderShipment>): OrderShipment => {
  return {
    carrier: valueOrNull(faker.lorem.word()),
    notes: valueOrNull(faker.lorem.words(10)),
    items: faker.helpers.multiple(() => orderShipmentItem(), countOptions),
    tracking_number: valueOrNull('null') || 'null',
    id: faker.string.uuid(),
    order_number: faker.phone.imei(),
    to: orderAddressFactory(),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    ...context?.override
  }
}

export const orderShipmentItem = (context?: FactoryContext<OrderShipmentItemResponse>) => {
  return {
    item_id: faker.string.uuid(),
    quantity: faker.number.int(),
    max: faker.helpers.maybe(() => faker.number.int()),
    sku: faker.helpers.maybe(() => faker.lorem.slug(4)),
    image: faker.helpers.maybe(() => faker.image.url()),
    name: faker.helpers.maybe(() => faker.lorem.words(4)),
    ...context?.override
  }
}

export const orderDocumentFactory = (context?: FactoryContext<OrderDocument>): OrderDocument => {
  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement([
      OrderDocumentType.CREDIT_MEMO,
      OrderDocumentType.INVOICE,
      OrderDocumentType.RECEIPT
    ]),
    customer: orderCustomerFactory(),
    billing_address: orderAddressFactory(),
    shipping_address: orderAddressFactory(),
    shipping_same_as_store: faker.datatype.boolean(),
    billing_same_as_store: faker.datatype.boolean(),
    shipping_method: faker.lorem.words(5),
    payment_method: faker.lorem.words(5),
    locale: fakerUtils.locale(),
    order_number: faker.phone.imei(),
    note: faker.lorem.sentences(1),
    taxes: [] || faker.helpers.multiple(() => taxFactory(), countOptions),
    vat_in_price: faker.datatype.boolean(),
    discount_after_tax: faker.datatype.boolean(),
    tax_type: faker.helpers.arrayElement(['sales', 'vat']),
    footer_text: faker.lorem.words(10),
    discounts_in_price: faker.datatype.boolean(),
    requested_delivery: null,
    store_address: orderDocumentStoreAddressFactory(),
    store_brand: orderDocumentStoreBrandFactory(),
    store_contact: orderDocumentStoreContactFactory(),
    number: faker.phone.imei(),
    transactions: faker.helpers.multiple(() => orderTransactionFactory(), countOptions),
    created_at: faker.date.past().toISOString(),
    summary: orderSummaryFactory(),
    items: faker.helpers.multiple(() => orderItemFactory(), countOptions),
    shipping: orderShippingFactory(),
    order_id: faker.string.uuid(),
    updated_at: faker.date.past().toISOString(),
    ...context?.override
  }
}

export const orderTransactionFactory = (context?: FactoryContext<OrderTransaction>): OrderTransaction => {
  const { data, message, organisation, store, url, ...orderTransaction } = transactionFactory(context)
  return orderTransaction
}

export const orderDocumentStoreAddressFactory = (
  context?: FactoryContext<OrderDocument['store_address']>
): OrderDocument['store_address'] => {
  return {
    name: 'Braun, Terry and Pouros',
    street: '743 Tillman Path Suite 569',
    city: 'Lonnyberga',
    postcode: '13275',
    country_code: 'GL',
    company_id: '1096341741',
    country: 'Greenland',
    ...context?.override
  }
}

export const orderDocumentStoreBrandFactory = (): OrderDocument['store_brand'] => ({
  logo: valueOrNull(faker.image.url()) || 'null'
})

export const orderDocumentStoreContactFactory = (
  context?: FactoryContext<OrderDocument['store_contact']>
): OrderDocument['store_contact'] => {
  return {
    telephone: valueOrNull(faker.phone.number()) || 'null',
    email: faker.internet.email(),
    ...context?.override
  }
}
