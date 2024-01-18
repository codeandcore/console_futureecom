import { applicationTypesFactories } from '~/tests/factories/applicationTypesFactories'
import { canOverride, countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { Category, CategoryTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

interface CategoryFactoryOptions {
  with: 'translations'[]
}

export const categoryFactory = (context?: FactoryContext<Category>, options?: CategoryFactoryOptions): Category => {
  const category: Category = {
    id: faker.string.uuid(),
    order: faker.number.int(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    name: faker.lorem.words(3),
    slug: faker.lorem.slug(3),
    image_url: faker.image.url(),
    application: faker.helpers.maybe(() => valueOrNull(applicationTypesFactories({ limited: true }))),
    customer_group: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.string.uuid, countOptions))),
    description: faker.lorem.text(),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    customer_ids: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.string.uuid, countOptions))),
    parent_ids: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.string.uuid, countOptions))),
    children_ids: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.string.uuid, countOptions))),
    product_ids: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.string.uuid, countOptions))),

    ...context?.override,

    products: canOverride('products', context)
      ? faker.helpers.maybe(() =>
          faker.helpers.multiple(() => productFactory({ override: { categories: undefined } }), countOptions)
        )
      : undefined,

    parents: canOverride('parents', context)
      ? faker.helpers.maybe(() =>
          faker.helpers.multiple(
            () => categoryFactory({ override: { parents: undefined, children: undefined } }),
            countOptions
          )
        )
      : undefined,

    children: canOverride('children', context)
      ? faker.helpers.maybe(() =>
          faker.helpers.multiple(
            () => categoryFactory({ override: { parents: undefined, children: undefined } }),
            countOptions
          )
        )
      : undefined
  }

  if (options?.with.includes('translations')) {
    category['translations'] = {
      en: categoryTranslationFactory(),
      he: categoryTranslationFactory(),
      fr: categoryTranslationFactory(),
      ca: categoryTranslationFactory()
    }
  }

  return category
}

export const categoryTranslationFactory = (context?: FactoryContext<CategoryTranslations>): CategoryTranslations => {
  return {
    name: faker.helpers.maybe(() => faker.lorem.words(4)),
    description: faker.lorem.text(),
    ...context?.override
  }
}
