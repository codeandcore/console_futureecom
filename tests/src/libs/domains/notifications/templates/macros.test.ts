import {
  canPutIfCondition,
  getFormattedMacro,
  getMacroElseConditionWrapper,
  getMacroIfConditionWrapper,
  getMacroItemsLoopWrapper,
  getMacroWrapper,
  getMacrosAttributes
} from '@/libs/domains/notifications/templates/macros'

describe('Test for notification templates macros utils', () => {
  it('returns standard wrapped macro', () => {
    const expected = '{{foo}}'
    expect(getMacroWrapper('foo')).toEqual(expected)
  })

  it('returns if-condition macro', () => {
    const expected = '{{#foo}}\n\t{{foo}}\n{{/foo}}'
    expect(getMacroIfConditionWrapper('foo')).toEqual(expected)
  })

  it('returns else-condition macro', () => {
    const expected = '{{^foo}}\n\n{{/foo}}'
    expect(getMacroElseConditionWrapper('foo')).toEqual(expected)
  })

  it('returns loop-condition macro with empty array', () => {
    const expected = '{{foo}}\n{{/foo}}'
    expect(getMacroItemsLoopWrapper('foo', [])).toEqual(expected)
  })

  it('returns loop-condition macro with values', () => {
    const expected = '{{foo}}\n\t{{bar}}\n\t{{foobar}}\n{{/foo}}'
    expect(getMacroItemsLoopWrapper('foo', ['bar', 'foobar'])).toEqual(expected)
  })

  it('disallows to put if-condition', () => {
    expect(canPutIfCondition(['foo'])).toBeFalse()
  })

  it('allows to put else-condition and empty value', () => {
    expect(canPutIfCondition([])).toBeTrue()
  })

  it('allows to put else-condition and empty string value', () => {
    expect(canPutIfCondition([])).toBeTrue()
  })

  it('formats string macro', () => {
    const expected = '{{foo}}'
    expect(getFormattedMacro('foo', true)).toBe(expected)
  })

  it('formats empty macro', () => {
    expect(getFormattedMacro({})).toBe('')
  })

  it('formats nullable macro without else condition', () => {
    const expected = '{{#foo}}\n\t{{foo}}\n{{/foo}}'
    expect(getFormattedMacro({ foo: [] })).toBe(expected)
  })

  it('formats nullable macro with included else condition', () => {
    const ifValue = '{{#foo}}\n\t{{foo}}\n{{/foo}}'
    const elseValue = '{{^foo}}\n\n{{/foo}}'

    const expected = `${ifValue}\n${elseValue}`
    expect(getFormattedMacro({ foo: [] }, true)).toBe(expected)
  })

  it('formats arrays of values', () => {
    const expected = '{{foo}}\n\t{{bar}}\n\t{{foobar}}\n{{/foo}}'
    expect(getFormattedMacro({ foo: ['bar', 'foobar'] }, true)).toBe(expected)
  })

  it('gets macro attribute based on existing code', () => {
    expect(getMacrosAttributes('client.credentials')).toBeArray()
  })
})
