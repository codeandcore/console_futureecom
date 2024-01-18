import { filterRouteQuery } from '@/libs/router/stringifyRouteQuery'

describe('Test for filtering vue route queries to string or object', () => {
  it('stringifies empty array', () => {
    expect(filterRouteQuery('foo', '[]')).toBe('[]')
  })

  it('does not stringifies empty string', () => {
    expect(filterRouteQuery('foo', '')).toBe('')
  })

  it('returns null as stringified null', () => {
    expect(filterRouteQuery('foo', null)).toBe('null')
  })

  it('returns object as it is', () => {
    expect(filterRouteQuery('foo', { foo: 'bar ' })).toStrictEqual({ foo: 'bar ' })
  })

  it('returns boolean values as it is', () => {
    expect(filterRouteQuery('foo', false)).toBeFalse()
    expect(filterRouteQuery('foo', true)).toBeTrue()
  })
})
