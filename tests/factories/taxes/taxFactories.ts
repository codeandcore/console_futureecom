import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { moneyFactory } from '~/tests/factories/moneyFactories'
import type { BaseVat, Tax, TaxRate, Vat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

export const taxFactory = (context?: FactoryContext<Tax>): Tax => {
  return {
    name: faker.lorem.word(),
    code: faker.lorem.slug(),
    rate: faker.number.float({ min: 0, max: 1, precision: 2 }),
    rate_type: faker.helpers.maybe(() => 'percentage'),
    tax: moneyFactory({ random: true }),
    ...context?.override
  }
}

interface TaxRateFactoryOptions {
  with: 'tax_group_ids'[]
}

export const taxRateFactory = (context?: FactoryContext<TaxRate>, options?: TaxRateFactoryOptions): TaxRate => {
  const taxRate = {
    name: faker.lorem.text(),
    code: faker.lorem.slug(),
    rate: faker.number.float({ min: 0, max: 1, precision: 2 }),
    organisation: faker.number.int(),
    store: faker.number.int(),
    id: faker.string.uuid(),
    updated_at: faker.date.past().toISOString(),
    created_at: faker.date.past().toISOString(),
    ...context?.override
  }

  if (options?.with?.includes('tax_group_ids')) {
    taxRate['tax_group_ids'] = faker.helpers.multiple(faker.string.uuid, countOptions)
  }

  return taxRate
}

export const vatFactory = (context?: FactoryContext<Vat>): Vat => {
  return {
    name: faker.lorem.text(),
    value: faker.number.float({ min: 0, max: 1, precision: 2 }),
    ...context?.override
  }
}

export const BaseVatRateFactory = (context?: FactoryContext<BaseVat>): BaseVat => {
  return {
    id: faker.string.uuid(),
    ...vatFactory(context),
    ...context?.override
  }
}
