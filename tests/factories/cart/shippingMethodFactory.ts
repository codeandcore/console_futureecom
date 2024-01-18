import { BaseVatRateFactory } from '~/tests/factories/taxes/taxFactories'
import { ShippingPriceType, ShippingType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { applicationTypesFactories } from '~/tests/factories/applicationTypesFactories'
import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { moneyFactory } from '~/tests/factories/moneyFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Shipping, ShippingTranslation } from '@futureecom/futureecom-js/dist/services/cart-service'

interface ShippingMethodFactoryOptions {
  with: ('vat' | 'translations')[]
}

export const shippingMethodFactory = (
  context?: FactoryContext<Shipping>,
  options?: ShippingMethodFactoryOptions
): Shipping => {
  const shipping: Shipping = {
    id: faker.string.uuid(),
    order: faker.number.int(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    enabled: faker.datatype.boolean(),
    price_type: faker.helpers.arrayElement([ShippingPriceType.FIXED, ShippingPriceType.PER_ITEM]),
    type: faker.helpers.arrayElement([ShippingType.PICKUP, ShippingType.DELIVERY]),
    application: faker.helpers.maybe(() =>
      faker.helpers.arrayElements(applicationTypesFactories(), countOptions.count)
    ),
    price: faker.helpers.maybe(moneyFactory),
    gross_price: faker.helpers.maybe(() => valueOrNull(moneyFactory())),
    carrier: faker.lorem.word(),
    min_delivery_days: faker.number.int(),
    max_delivery_days: faker.number.int(),
    zone_codes: faker.helpers.maybe(() => faker.helpers.multiple(faker.lorem.word, countOptions)),
    name: faker.lorem.words(3),
    code: faker.lorem.slug(3),
    ...context?.override
  }

  if (options?.with?.includes('vat')) {
    shipping['vat'] = faker.helpers.maybe(BaseVatRateFactory)
  }
  if (options?.with?.includes('translations')) {
    shipping['translations'] = {
      en: shippingMethodTranslationFactory(),
      he: shippingMethodTranslationFactory(),
      fr: shippingMethodTranslationFactory(),
      ca: shippingMethodTranslationFactory()
    }
  }

  return shipping
}

export const shippingMethodTranslationFactory = (
  context?: FactoryContext<ShippingTranslation>
): ShippingTranslation => {
  return {
    //@ts-expect-error
    name: faker.helpers.maybe(() => faker.lorem.words(4)),
    vat: faker.helpers.maybe(() => ({ name: faker.lorem.words(4) })),
    ...context?.override
  }
}
