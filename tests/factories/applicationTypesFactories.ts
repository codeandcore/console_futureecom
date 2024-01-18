import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { faker } from '@faker-js/faker'

export const applicationTypesFactories = (context?: { limited: boolean }) => {
  if (context?.limited) {
    return faker.helpers.arrayElements([ApplicationType.STOREFRONT, ApplicationType.POS, ApplicationType.CONSOLE])
  }

  return faker.helpers.arrayElements([
    ApplicationType.API,
    ApplicationType.STOREFRONT,
    ApplicationType.POS,
    ApplicationType.OVERVIEW,
    ApplicationType.CONSOLE
  ])
}
