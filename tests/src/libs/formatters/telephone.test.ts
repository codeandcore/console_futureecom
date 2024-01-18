import { formatTelephone } from '@/libs/formatters/telephone'
import type { Telephone } from '@futureecom/futureecom-js'

describe('Telephone formatter util tests', () => {
  it('formats telephone prefix and number to string', () => {
    const telephone: Telephone = {
      prefix: '1',
      number: '2233-441-5'
    }

    expect(formatTelephone(telephone)).toBe('+1 2233-441-5')
  })

  it('formats telephone without prefix to string', () => {
    const telephone: Telephone = {
      prefix: '',
      number: '2233-441-5'
    }

    expect(formatTelephone(telephone)).toBe('2233-441-5')
  })
})
