import {
  InventoryPolicy,
  ProductClassification,
  ProductSimple,
  ProductType
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import { applicationTypesFactories } from '~/tests/factories/applicationTypesFactories'
import { canOverride, countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { isBundle, isConfigurable } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { moneyFactory } from '~/tests/factories/moneyFactories'
import { taxonomyFactory } from '~/tests/factories/catalog/taxonomyFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type {
  Product,
  ProductBundle,
  ProductComponent,
  ProductConfigurable,
  ProductDescription,
  ProductExtraOptions,
  ProductExtras,
  ProductInventory,
  ProductProperty,
  ProductTranslations,
  ProductVariant
} from '@futureecom/futureecom-js/dist/services/catalog-service'

interface ProductFactoryOptions {
  type: 'simple' | 'configurable' | 'bundle'
  with: ('extras' | 'properties' | 'translations')[]
}

export const productFactory = (context?: FactoryContext<Product>, options?: ProductFactoryOptions): Product => {
  const type: ProductType = faker.helpers.arrayElement([ProductType.PHYSICAL, ProductType.DIGITAL, ProductType.VIRTUAL])

  const product: ProductSimple = {
    order: faker.number.int(),
    id: faker.string.uuid(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    name: faker.lorem.words(4),
    sku: faker.lorem.slug(4),
    description: faker.helpers.maybe(() =>
      valueOrNull(faker.helpers.multiple(productDescriptionFactory, countOptions))
    ),
    application: faker.helpers.maybe(() => valueOrNull(applicationTypesFactories({ limited: true }))),
    type,
    slug: faker.lorem.slug(4),
    image_url: faker.image.url(),
    translations: valueOrNull({}),
    price: moneyFactory(),
    sale_price: moneyFactory(),
    gross_price: moneyFactory(),
    gross_sale_price: faker.helpers.maybe(() => valueOrNull(moneyFactory())),
    real_price: moneyFactory(),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    inventory: productInventoryFactory({ override: context?.override?.inventory }),

    ...context?.override,
    classification: ProductClassification.COMMON,
    taxonomy: canOverride('taxonomy', context) ? null : taxonomyFactory({ override: { products: undefined } })
  }

  if (options?.with?.includes('extras')) {
    product['extras'] = faker.helpers.multiple(productExtrasFactory, countOptions)
  }

  if (options?.with?.includes('properties')) {
    product['properties'] = faker.helpers.multiple(productPropertyFactory, countOptions)
  }

  if (options?.with?.includes('translations')) {
    product['translations'] = {
      en: productTranslationFactory(),
      he: productTranslationFactory(),
      fr: productTranslationFactory(),
      ca: productTranslationFactory()
    }
  }

  if (options?.type === 'configurable' && context?.override && isConfigurable(context?.override)) {
    const configurableProduct: ProductConfigurable = {
      ...product,
      classification: ProductClassification.COMMON,

      variants: canOverride('variants', context)
        ? context?.override?.variants
        : faker.helpers.multiple(productVariantFactory, countOptions),

      children: canOverride('children', context)
        ? context?.override?.children
        : faker.helpers.multiple(() => productFactory({ override: { children: undefined } }), countOptions)
    }
    return configurableProduct
  }

  if (options?.type === 'bundle' && context?.override && isBundle(context?.override)) {
    const bundleProduct: ProductBundle = {
      ...product,
      classification: ProductClassification.BUNDLE,
      components: canOverride('components', context)
        ? context?.override?.components
        : faker.helpers.multiple(productComponentFactory, countOptions)
    }
    return bundleProduct
  }

  return product
}

export const productInventoryFactory = (context?: FactoryContext<ProductInventory>): ProductInventory => {
  return {
    policy: valueOrNull(faker.helpers.arrayElement([InventoryPolicy.CONTINUE, InventoryPolicy.STOP])),
    track: valueOrNull(faker.datatype.boolean()),
    is_available: valueOrNull(faker.datatype.boolean()),
    is_restockable: valueOrNull(faker.datatype.boolean()),
    quantity: faker.number.int(),
    min_per_order: faker.number.int(),
    max_per_order: faker.number.int(),
    is_bundle_exclusive: faker.datatype.boolean(),
    ...context?.override
  }
}

export const productTranslationFactory = (context?: FactoryContext<ProductTranslations>): ProductTranslations => {
  return {
    name: faker.helpers.maybe(() => faker.lorem.words(4)),
    slug: faker.helpers.maybe(() => faker.lorem.slug(4)),
    //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-1427
    description: faker.helpers.maybe(() => faker.helpers.multiple(productDescriptionFactory, countOptions)),
    properties: faker.helpers.maybe(() => faker.helpers.multiple(productPropertyFactory, countOptions)),
    extras: faker.helpers.maybe(() => faker.helpers.multiple(productExtrasFactory, countOptions)),
    vat: faker.helpers.maybe(() => ({ name: faker.lorem.words(4) })),
    ...context?.override
  }
}

export const productDescriptionFactory = (context?: FactoryContext<ProductDescription>): ProductDescription => {
  return {
    key: faker.string.uuid(),
    title: faker.lorem.words(5),
    content: faker.lorem.text(),
    ...context?.override
  }
}

export const productPropertyFactory = (context?: FactoryContext<ProductProperty>): ProductProperty => {
  return {
    key: faker.string.uuid(),
    name: faker.lorem.word(),
    value: faker.lorem.text(),
    ...context?.override
  }
}

export const productExtrasFactory = (context?: FactoryContext<ProductExtras>): ProductExtras => {
  return {
    key: faker.string.uuid(),
    name: faker.lorem.word(),
    options: faker.helpers.multiple(productExtraOptionsFactory, countOptions),
    limit: faker.number.int(),
    ...context?.override
  }
}

export const productExtraOptionsFactory = (context?: FactoryContext<ProductExtraOptions>): ProductExtraOptions => {
  return {
    key: faker.string.uuid(),
    value: faker.lorem.word(),
    ...context?.override
  }
}

export const productVariantFactory = (context?: FactoryContext<ProductVariant>): ProductVariant => {
  return {
    key: faker.string.uuid(),
    name: faker.lorem.word(),
    options: faker.helpers.multiple(faker.lorem.word, countOptions),
    ...context?.override
  }
}

export const productComponentFactory = (context?: FactoryContext<ProductComponent>): ProductComponent => {
  return {
    key: faker.string.uuid(),
    id: faker.string.uuid(),
    quantity: faker.number.int(),
    ...context?.override
  }
}
