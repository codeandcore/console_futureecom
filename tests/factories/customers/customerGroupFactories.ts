import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import type { CustomerGroup } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

export const customerGroupFactory = (context?: FactoryContext<CustomerGroup>): CustomerGroup => {
  return {
    id: faker.string.uuid(),
    organisation: faker.number.int(),
    store: faker.number.int(),
    code: faker.lorem.word(),
    name: faker.lorem.words(3),
    mandatory: faker.helpers.maybe(faker.datatype.boolean),
    customer_ids: faker.helpers.multiple(faker.string.uuid, countOptions),
    ...context?.override
  }
}
