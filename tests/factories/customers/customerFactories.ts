import { faker } from '@faker-js/faker'
import { fakerUtils } from '~/tests/factories/helpers/locale'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'

export const customerAddressFactory = (context?: FactoryContext<CustomerAddress>): CustomerAddress => {
  return {
    id: faker.string.uuid(),
    country_code: faker.location.countryCode(),
    administrative_area: '',
    locality: faker.location.city(),
    postal_code: faker.location.zipCode(),
    address_line1: faker.location.streetAddress(),
    given_name: faker.person.firstName(),
    family_name: faker.person.lastName(),
    organization: faker.helpers.maybe(() => faker.company.name()),
    telephone: faker.helpers.maybe(() => null),
    is_default: faker.helpers.maybe(() => faker.datatype.boolean()),
    locale: faker.helpers.maybe(() => fakerUtils.locale()),
    dependent_locality: faker.helpers.maybe(() => faker.location.state()),
    sorting_code: faker.helpers.maybe(() => ''),
    address_line2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
    additional_name: faker.helpers.maybe(() => faker.person.middleName()),
    ...context?.override
  }
}
