import { formatCodeToHumanText } from '@/libs/domains/report/formatters'

describe('Test for sales report formatting code helpers', () => {
  it('formats code to human readable text', () => {
    expect(formatCodeToHumanText('foo')).toEqual('foo')
    expect(formatCodeToHumanText('foo.bar')).toEqual('foo bar')
    expect(formatCodeToHumanText('foo_bar')).toEqual('foo bar')
    expect(formatCodeToHumanText('foo.bar_foo')).toEqual('foo bar foo')
    expect(formatCodeToHumanText('foo.bar_foo')).toEqual('foo bar foo')
  })
})
