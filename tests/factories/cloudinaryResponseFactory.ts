import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import type { CloudinaryResponse } from '@/types/CloudinaryResponse'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

export const cloudinaryResponseFactory = (context?: FactoryContext<CloudinaryResponse>): CloudinaryResponse => {
  return {
    asset_id: faker.string.uuid(),
    bytes: faker.number.int(),
    created_at: faker.date.future().toISOString(),
    etag: faker.lorem.slug(4),
    format: faker.helpers.arrayElement(['png', 'jpg', 'gif', 'svg', 'webp']),
    height: faker.number.int(),
    original_filename: faker.lorem.words(4),
    placeholder: false,
    public_id: faker.string.uuid(),
    resource_type: faker.system.fileType(),
    secure_url: faker.image.url(),
    signature: faker.lorem.slug(4),
    tags: faker.helpers.multiple(faker.lorem.word, countOptions),
    type: faker.system.mimeType(),
    url: faker.image.url(),
    version: faker.number.int(),
    version_id: faker.string.uuid(),
    width: faker.number.int(),
    ...context?.override
  }
}
