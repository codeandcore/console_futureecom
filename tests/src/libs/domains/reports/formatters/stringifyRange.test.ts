import { stringifyRange } from '@/libs/domains/report/formatters'

describe('Test for sales report stringifyRange helper', () => {
  it('should return an empty string for non-object values', () => {
    expect(stringifyRange(null)).toBe('')
    expect(stringifyRange(undefined)).toBe('')
    expect(stringifyRange('randomString')).toBe('')
    expect(stringifyRange(12345)).toBe('')
  })

  it('should handle objects without gte or lte', () => {
    expect(stringifyRange({})).toBe('')
    expect(stringifyRange({ randomField: 'randomValue' })).toBe('')
  })

  it('should handle objects with gte or lte', () => {
    expect(stringifyRange({ gte: '2023-01-01' })).toBe('2023-01-01')
    expect(stringifyRange({ lte: '2023-12-31' })).toBe('2023-12-31')
    expect(stringifyRange({ gte: '2023-01-01', lte: '2023-12-31' })).toBe('2023-01-01 - 2023-12-31')
  })

  it('should handle objects where gte or lte are themselves objects', () => {
    expect(stringifyRange({ gte: { start: '2023-01-01' } })).toBe('[object Object]')
    expect(stringifyRange({ lte: { end: '2023-12-31' } })).toBe('[object Object]')
    expect(stringifyRange({ gte: { start: '2023-01-01' }, lte: '2023-12-31' })).toBe('[object Object] - 2023-12-31')
    expect(
      stringifyRange({
        gte: { start: '2023-01-01' },
        lte: { start: '2023-12-31' }
      })
    ).toBe('[object Object] - [object Object]')
  })
})
