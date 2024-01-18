import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { productFactory } from '~/tests/factories/catalog/productFactories'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { Brand } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

interface BrandFactoryOptions {
  with: ('products' | 'product_ids')[]
}

export const brandFactory = (context?: FactoryContext<Brand>, options?: BrandFactoryOptions): Brand => {
  const brand: Brand = {
    id: faker.string.uuid(),
    order: faker.number.int(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    name: faker.lorem.words(3),
    slug: faker.lorem.slug(3),
    description: faker.helpers.maybe(() => valueOrNull(faker.lorem.words(150))),
    image_url: faker.helpers.maybe(() => valueOrNull(faker.image.url())),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    ...context?.override
  }

  if (options?.with?.includes('product_ids')) {
    brand['products'] = faker.helpers.multiple(() => productFactory(), countOptions)
    brand['product_ids'] = faker.helpers.multiple(faker.string.uuid, countOptions)
  }

  return brand
}
