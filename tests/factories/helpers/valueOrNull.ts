import { faker } from '@faker-js/faker'

export const valueOrNull = <T = unknown>(val: T): T | null => {
  const value = faker.helpers.maybe(() => val)
  return value === undefined ? null : value
}
