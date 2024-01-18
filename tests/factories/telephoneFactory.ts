import { faker } from '@faker-js/faker'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Telephone } from '@futureecom/futureecom-js'

export const telephoneFactory = (context?: FactoryContext<Telephone>): Telephone => {
  return {
    prefix: faker.number.int({ min: 1, max: 100 }),
    number: faker.phone.number(),
    ...context?.override
  }
}
