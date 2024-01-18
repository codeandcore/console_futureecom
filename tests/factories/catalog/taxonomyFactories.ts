import { applicationTypesFactories } from '~/tests/factories/applicationTypesFactories'
import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { productFactory } from './productFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

interface TaxonomyFactoryOptions {
  with: ('parent' | 'children' | 'products')[]
}

export const taxonomyFactory = (context?: FactoryContext<Taxonomy>, options?: TaxonomyFactoryOptions): Taxonomy => {
  const taxonomy: Taxonomy = {
    id: faker.string.uuid(),
    order: faker.number.int(),
    code: faker.number.int(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    name: faker.lorem.words(4),
    application: faker.helpers.maybe(() => valueOrNull(applicationTypesFactories({ limited: true }))),
    customer_group: faker.helpers.maybe(() => valueOrNull(faker.helpers.multiple(faker.lorem.word, countOptions))),
    image_url: faker.helpers.maybe(faker.image.url),
    children_ids: faker.helpers.maybe(() => faker.helpers.multiple(faker.string.uuid, countOptions)),
    product_ids: faker.helpers.maybe(() => faker.helpers.multiple(faker.string.uuid, countOptions)),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    ...context?.override
  }

  if (options?.with?.includes('parent')) {
    const parent = faker.helpers.maybe(taxonomyFactory)
    taxonomy['parent'] = parent
    taxonomy['parent_id'] = parent?.id
  }

  if (options?.with?.includes('children')) {
    taxonomy['children'] = faker.helpers.maybe(() => faker.helpers.multiple(taxonomyFactory, countOptions))
  }

  if (options?.with?.includes('products')) {
    taxonomy['products'] = faker.helpers.maybe(() => faker.helpers.multiple(productFactory, countOptions))
  }

  return taxonomy
}
