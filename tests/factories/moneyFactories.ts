import { faker } from '@faker-js/faker'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Money } from '@futureecom/futureecom-js'

export const moneyFactory = (context?: FactoryContext<Money>): Money => {
  return {
    amount: faker.number.int(999999),
    currency: faker.finance.currencyCode(),
    ...context?.override
  }
}
