import { TransactionStatus } from '@futureecom/futureecom-js/dist/services/payment-service'
import { faker } from '@faker-js/faker'
import { moneyFactory } from '~/tests/factories/moneyFactories'
import { randomContext } from '~/tests/factories/helpers/factoryContext'
import { valueOrNull } from '~/tests/factories/helpers/valueOrNull'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Transaction } from '@futureecom/futureecom-js/dist/services/payment-service'

export const transactionFactory = (context?: FactoryContext<Transaction>): Transaction => {
  return {
    organisation: faker.number.int(),
    store: faker.number.int(),
    data: [],
    url: valueOrNull(faker.internet.url()),
    message: valueOrNull(faker.lorem.sentence()),
    amount: moneyFactory(randomContext),
    customer: {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email()
    },
    id: faker.string.uuid(),
    provider: faker.helpers.arrayElement(['bank_transfer', 'paypal', 'braintree', 'cardknox', 'cash']),
    reference_id: valueOrNull(faker.string.uuid()),
    transaction_reference: faker.helpers.maybe(() => faker.string.uuid()),
    status: faker.helpers.enumValue(TransactionStatus),
    payment_type: faker.helpers.arrayElement(['offline', 'online']),
    type: faker.helpers.arrayElement(['authorize', 'payment', 'refund']),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    ...context?.override
  }
}
