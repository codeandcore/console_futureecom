import { isEmptyObject, isFile, isObject, removeEmptyFields } from '@/libs/objects'

describe('Tests for object helpers', () => {
  it('detects if given value is an object as {} using isObject', () => {
    expect(isObject({})).toBeTrue()
    expect(isObject({ val: 'foo' })).toBeTrue()

    expect(isObject(null)).toBeFalse()
    expect(isObject([])).toBeFalse()
    expect(isObject('')).toBeFalse()
    expect(isObject(undefined)).toBeFalse()
  })

  it('detects if given object has no keys using isEmptyObject', () => {
    expect(isEmptyObject({})).toBeTrue()

    expect(isEmptyObject({ val: 'foo' })).toBeFalse()
    expect(isEmptyObject(null)).toBeFalse()
    expect(isEmptyObject([])).toBeFalse()
    expect(isEmptyObject('')).toBeFalse()
    expect(isEmptyObject(undefined)).toBeFalse()
  })

  it('detects if given value is a File type', () => {
    expect(isFile(new File([], 'foo.png', { lastModified: Date.now() }))).toBeTrue()
    expect(isFile(new File([], 'foo.png'))).toBeTrue()

    expect(isFile({ val: 'foo' })).toBeFalse()
    expect(isFile(null)).toBeFalse()
    expect(isFile([])).toBeFalse()
    expect(isFile('')).toBeFalse()
    expect(isFile(undefined)).toBeFalse()
    expect(isFile(123)).toBeFalse()
  })
})

describe('Tests for removing empty field object helpers using removeEmptyFields', () => {
  it('removes all keyless objects or undefined fields', () => {
    expect(removeEmptyFields({})).toStrictEqual(undefined)

    const val = { foo: null, bar: '', a: [], b: false, c: { nested: undefined } }
    const expected = { foo: null, bar: '', a: [], b: false }
    expect(removeEmptyFields(val)).toStrictEqual(expected)
  })

  it('removes all empty values specified in options and keyless/undefined fields', () => {
    const options = { nullValue: true, emptyArray: true, emptyString: true }
    expect(removeEmptyFields({}, options)).toStrictEqual(undefined)

    const val = { foo: null, bar: '', a: [], b: false, c: { nested: undefined } }
    const expected = { b: false }

    expect(removeEmptyFields(val, options)).toStrictEqual(expected)
  })
})
