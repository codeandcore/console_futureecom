import { categoryFactory } from './categoryFactories'
import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { taxonomyFactory } from '~/tests/factories/catalog/taxonomyFactories'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Tag, TagTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'

interface TagFactoryOptions {
  with: ('product_ids' | 'category_ids' | 'taxonomy_ids' | 'translations')[]
}

export const tagFactory = (context?: FactoryContext<Tag>, options?: TagFactoryOptions): Tag => {
  const tag: Tag = {
    id: faker.string.uuid(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    name: faker.lorem.words(3),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    ...context?.override
  }

  if (options?.with.includes('product_ids')) {
    const products = faker.helpers.multiple(productFactory, countOptions)
    tag['products'] = products
    tag['product_ids'] = products.map((item) => item.id)
  }

  if (options?.with.includes('category_ids')) {
    const categories = faker.helpers.multiple(categoryFactory, countOptions)
    tag['categories'] = categories
    tag['category_ids'] = categories.map((item) => item.id)
  }

  if (options?.with.includes('taxonomy_ids')) {
    const taxonomies = faker.helpers.multiple(taxonomyFactory, countOptions)
    tag['taxonomies'] = taxonomies
    tag['taxonomy_ids'] = taxonomies.map((item) => item.id)
  }

  if (options?.with?.includes('translations')) {
    tag['translations'] = {
      en: tagTranslationFactory(),
      he: tagTranslationFactory(),
      fr: tagTranslationFactory(),
      ca: tagTranslationFactory()
    }
  }

  return tag
}

export const tagTranslationFactory = (context?: FactoryContext<TagTranslations>): TagTranslations => {
  return {
    name: faker.helpers.maybe(() => faker.lorem.words(4)),
    ...context?.override
  }
}
