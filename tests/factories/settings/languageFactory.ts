import { faker } from '@faker-js/faker'
import type { FactoryContext } from '~/tests/factories/helpers/factoryContext'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

export const languageFactory = (context?: FactoryContext<Language>): Language => {
  const code = () => faker.helpers.arrayElement(['VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV'])
  return {
    name: faker.helpers.arrayElement([
      'New Zealand',
      'Nicaragua',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Sint Maarten',
      'Slovakia',
      'Slovenia',
      'Solomon Islands'
    ]),
    code: code(),
    flag: faker.helpers.arrayElement(['🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭']),
    iso: `${code().toLowerCase()}-${code().toUpperCase()}`,
    dir: faker.helpers.arrayElement(['ltr', 'rtl']),
    default: faker.datatype.boolean(),
    ...context?.override
  }
}
