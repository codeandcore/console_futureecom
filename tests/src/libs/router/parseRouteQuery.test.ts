import { decodeRouteQuery } from '@/libs/router/parseRouteQuery'

describe('Tests for decoder for stringified queries', () => {
  const defaultDecoder = jest.fn((str: string) => str)

  it('returns given value when type is a key', () => {
    expect(decodeRouteQuery('foobar', defaultDecoder, '', 'key')).toBe('foobar')
    expect(defaultDecoder).toBeCalledTimes(0)
  })

  it('decodes stringified null to null', () => {
    expect(decodeRouteQuery('null', defaultDecoder, '', 'value')).toBe(null)
    expect(defaultDecoder).toBeCalledTimes(0)
  })

  it('decodes stringified empty array to array', () => {
    expect(decodeRouteQuery('[]', defaultDecoder, '', 'value')).toStrictEqual([])
    expect(defaultDecoder).toBeCalledTimes(0)
  })

  it('decodes value with given defaultDecoder', () => {
    expect(decodeRouteQuery('foo_bar', defaultDecoder, '', 'value')).toBe('foo_bar')
    expect(defaultDecoder).toBeCalledTimes(1)
  })
})
