import { faker } from '@faker-js/faker'

export const fakerUtils = {
  locale: () => faker.helpers.fromRegExp(/[a-z]{2}-[A-Z]{2}/)
}
