import { transformQuery } from '@/libs/transformQuery'

describe('Test for transforming query to string or object', () => {
  it('stringifies empty array', () => {
    expect(transformQuery([], { emptyArrayString: true })).toBe('[]')
  })
  it('returns empty array as it is', () => {
    expect(transformQuery([], { returnSource: true })).toStrictEqual([])
  })
  it('returns empty array as empty string', () => {
    expect(transformQuery([])).toBe('')
  })

  it('stringifies empty string', () => {
    expect(transformQuery('', { emptyString: true })).toBe('""')
  })
  it('returns empty string as it is', () => {
    expect(transformQuery('', { returnSource: true })).toStrictEqual('')
  })
  it('returns empty string as empty string', () => {
    expect(transformQuery('')).toBe('')
  })

  it('returns null as it is', () => {
    expect(transformQuery(null, { returnSource: true })).toStrictEqual(null)
  })
  it('returns null as stringified null', () => {
    expect(transformQuery(null)).toBe('null')
  })
})
