import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { faker } from '@faker-js/faker'
import type { CreatedBy } from '@futureecom/futureecom-js'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

export const createdByFactory = (context?: FactoryContext<CreatedBy>): CreatedBy => {
  return {
    name: faker.person.fullName(),
    from: faker.helpers.arrayElement([
      ApplicationType.API,
      ApplicationType.CONSOLE,
      ApplicationType.OVERVIEW,
      ApplicationType.POS,
      ApplicationType.STOREFRONT
    ]),
    ...context?.override
  }
}
