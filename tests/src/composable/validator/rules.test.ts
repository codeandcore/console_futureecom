import * as rules from '@/composable/validator/rules'

describe('Tests rule validations', () => {
  it('checks if rule "required" returns proper error message', () => {
    const errorMessage = 'Value can not be empty'

    expect(rules.required(null)).toEqual(errorMessage)
    expect(rules.required(undefined)).toEqual(errorMessage)
    expect(rules.required('')).toEqual(errorMessage)
    expect(rules.required([])).toEqual(errorMessage)

    expect(rules.required(0)).toEqual('')
    expect(rules.required(false)).toEqual('')
    expect(rules.required('100')).toEqual('')
    expect(rules.required(['foo', 'bar'])).toEqual('')
  })

  it('checks if rule "string" returns proper error message', () => {
    const errorMessage = 'Value must be a string'

    expect(rules.string(0)).toEqual(errorMessage)
    expect(rules.string(false)).toEqual(errorMessage)
    expect(rules.string([])).toEqual(errorMessage)
    expect(rules.string(['foo', 'bar'])).toEqual(errorMessage)

    expect(rules.string('')).toEqual('')
    expect(rules.string('foo')).toEqual('')
  })

  it('checks if rule "numeric" returns proper error message', () => {
    const errorMessage = 'Value must be a number'

    expect(rules.numeric('')).toEqual(errorMessage)
    expect(rules.numeric('test')).toEqual(errorMessage)
    expect(rules.numeric([])).toEqual(errorMessage)
    expect(rules.numeric(false)).toEqual(errorMessage)

    expect(rules.numeric(0)).toEqual('')
    expect(rules.numeric(1)).toEqual('')
  })

  it('checks if rule "array" returns proper error message', () => {
    const errorMessage = 'Value must be an array'

    expect(rules.array('')).toEqual(errorMessage)
    expect(rules.array('test')).toEqual(errorMessage)
    expect(rules.array(0)).toEqual(errorMessage)
    expect(rules.array(false)).toEqual(errorMessage)

    expect(rules.array([])).toEqual('')
    expect(rules.array(['foo', 'bar'])).toEqual('')
  })

  it('checks if rule "email" returns proper error message', () => {
    const errorMessage = 'Invalid email format'

    expect(rules.email(0)).toEqual(errorMessage)
    expect(rules.email(false)).toEqual(errorMessage)
    expect(rules.email(null)).toEqual(errorMessage)
    expect(rules.email(undefined)).toEqual(errorMessage)
    expect(rules.email('')).toEqual(errorMessage)
    expect(rules.email('foo')).toEqual(errorMessage)
    expect(rules.email('foo@')).toEqual(errorMessage)
    expect(rules.email('foo@bar')).toEqual(errorMessage)
    expect(rules.email('foo@.com')).toEqual(errorMessage)
    expect(rules.email('foo@com.')).toEqual(errorMessage)

    expect(rules.email('foo@bar.com')).toEqual('')
  })

  it('checks if rule "not_numbers_only" returns proper error message', () => {
    const errorMessage = "Value shouldn't be numeric"

    expect(rules.not_numbers_only('1234')).toEqual(errorMessage)
    expect(rules.not_numbers_only(1)).toEqual(errorMessage)
    expect(rules.not_numbers_only(0)).toEqual(errorMessage)

    expect(rules.not_numbers_only('foo')).toEqual('')
    expect(rules.not_numbers_only('foo123')).toEqual('')
    expect(rules.not_numbers_only('foo123bar')).toEqual('')
  })

  it('checks if rule "empty_spaces" returns proper error message', () => {
    const errorMessage = 'No whitespaces allowed'

    expect(rules.empty_spaces('foo ')).toEqual(errorMessage)
    expect(rules.empty_spaces(' foo')).toEqual(errorMessage)
    expect(rules.empty_spaces('foo bar')).toEqual(errorMessage)
    expect(rules.empty_spaces(' ')).toEqual(errorMessage)
    expect(rules.empty_spaces(' \n')).toEqual(errorMessage)
    expect(rules.empty_spaces(' \t')).toEqual(errorMessage)

    expect(rules.empty_spaces('foo')).toEqual('')
    expect(rules.empty_spaces('foo-bar')).toEqual('')
  })

  it('checks if rule "alpha_dash" returns proper error message', () => {
    const errorMessage = 'Value may only contain letters, numbers, dashes and underscores'

    expect(rules.alpha_dash('foo')).toEqual('')
    expect(rules.alpha_dash('foo-bar')).toEqual('')
    expect(rules.alpha_dash('foo_bar')).toEqual('')
    expect(rules.alpha_dash('-foo_bar')).toEqual('')
    expect(rules.alpha_dash('_foo-bar_')).toEqual('')
    expect(rules.alpha_dash('1234foo_bar')).toEqual('')
    expect(rules.alpha_dash('ężąźś')).toEqual('')
    expect(rules.alpha_dash('העשירי')).toEqual('')

    expect(rules.alpha_dash('foo bar')).toEqual(errorMessage)
    expect(rules.alpha_dash('foobar#$!@<>:"{}[]()`"')).toEqual(errorMessage)
  })

  it('checks if rule "min" returns proper error message', () => {
    expect(rules.min(10, 12)).toEqual('Min value is: 12')
    expect(rules.min([], 5)).toEqual('Min length is: 5')

    expect(rules.max(false, 10)).toEqual('')
    expect(rules.max(null, 10)).toEqual('')
    expect(rules.max(undefined, 10)).toEqual('')

    expect(rules.min('', 5)).toEqual('')
    expect(rules.min(10, 0)).toEqual('')
    expect(rules.min(10, -10)).toEqual('')
    expect(rules.min(10, 5)).toEqual('')
    expect(rules.min('foobar', 5)).toEqual('')
    expect(rules.min(['foo'], 1)).toEqual('')
    expect(rules.min(['foo', 'bar'], 1)).toEqual('')
  })

  it('checks if rule "max" returns proper error message', () => {
    expect(rules.max(12, 10)).toEqual('Max value is: 10')
    expect(rules.max('foobar', 5)).toEqual('Max length is: 5')
    expect(rules.max(['foo', 'bar'], 1)).toEqual('Max length is: 1')

    expect(rules.max(false, 10)).toEqual('')
    expect(rules.max(null, 10)).toEqual('')
    expect(rules.max(undefined, 10)).toEqual('')
    expect(rules.max('', 5)).toEqual('')

    expect(rules.max(0, 10)).toEqual('')
    expect(rules.max(-10, 10)).toEqual('')
    expect(rules.max(5, 10)).toEqual('')
    expect(rules.max(['foo'], 1)).toEqual('')
  })

  it('checks if rule "gt" returns proper error message', () => {
    expect(rules.gt(10, 11)).toEqual('Value must be greater than: 11')
    expect(rules.gt(10, 10)).toEqual('Value must be greater than: 10')
    expect(rules.gt(10, 9)).toEqual('')

    expect(rules.gt(false, 10)).toEqual('')
    expect(rules.gt(null, 10)).toEqual('')
    expect(rules.gt(undefined, 10)).toEqual('')
    expect(rules.gt('', 10)).toEqual('')
  })

  it('checks if rule "lt" returns proper error message', () => {
    expect(rules.lt(10, 9)).toEqual('Value must be less than: 9')
    expect(rules.lt(10, 10)).toEqual('Value must be less than: 10')
    expect(rules.lt(10, 11)).toEqual('')

    expect(rules.lt(false, 10)).toEqual('')
    expect(rules.lt(null, 10)).toEqual('')
    expect(rules.lt(undefined, 10)).toEqual('')
    expect(rules.lt('', 10)).toEqual('')
  })

  it('checks if rule "domain" returns proper error message', () => {
    const errorMessage = 'Invalid domain format'

    expect(rules.domain('')).toEqual(errorMessage)
    expect(rules.domain('futureecom .com')).toEqual(errorMessage)
    expect(rules.domain('futureecom. com')).toEqual(errorMessage)
    expect(rules.domain('futureecom . com')).toEqual(errorMessage)
    expect(rules.domain('futureecom')).toEqual(errorMessage)
    expect(rules.domain('example. futureecom')).toEqual(errorMessage)
    expect(rules.domain('example . futureecom')).toEqual(errorMessage)
    expect(rules.domain('futureecom@com')).toEqual(errorMessage)
    expect(rules.domain('http://www.futureecom.io')).toEqual(errorMessage)

    expect(rules.domain('www.futureecom.io')).toEqual('')
    expect(rules.domain('example.futureecom.io')).toEqual('')
    expect(rules.domain('futureecom.io')).toEqual('')
  })

  it('checks if rule "regex" returns proper error message', () => {
    const errorMessage = 'Value does not match given pattern'
    const regex = '^(?!.*[?&#%<>+/])'

    expect(rules.regex('?&#%', regex)).toEqual(errorMessage)
    expect(rules.regex('?!.*[?&#%<>+/]', regex)).toEqual(errorMessage)

    expect(rules.regex('futureecom1234', regex)).toEqual('')
    expect(rules.regex('example.futureecom_foo_bar', regex)).toEqual('')
    expect(rules.regex('futureecom', regex)).toEqual('')
  })
})
