import '~/tests/configs/vue-composition-api-config.ts'

import {
  extendWildcardRules,
  getChipErrors,
  getCustomMessageFallback,
  getErrorsStartingWith
} from '@/composable/validator/useValidator'
import { getSectionErrors, mapErrors } from '@/composable/validator/useValidator'
import { useValidator } from '@/composable/validator/useValidator'
import { validateRules } from '@/composable/validator/useValidator'
import type { Rules, ValidationErrors } from '@/types/validator'

describe('Tests validateRules helpers', () => {
  it('checks if array of existing rules is executed and returns proper error messages', () => {
    const rulesFoo: Rules = ['required', 'numeric']

    expect(validateRules(rulesFoo, '')).toBe('Value can not be empty')
    expect(validateRules(rulesFoo, 'foo')).toBe('Value must be a number')
    expect(validateRules(rulesFoo, 0)).toBe('')

    const rulesBar: Rules = ['nullable']

    expect(validateRules(rulesBar, '')).toBe('')
  })

  it('checks if array of rules as functions is executed and returns proper error messages', () => {
    const ruleFn: Rules = [
      (val: any) => (val < 5 ? 'Sample foo error message' : ''),
      (val: any) => (val < 6 ? 'Sample bar error message' : '')
    ]

    expect(validateRules(ruleFn, 3)).toBe('Sample foo error message')
    expect(validateRules(ruleFn, 5)).toBe('Sample bar error message')
    expect(validateRules(ruleFn, 6)).toBe('')
  })

  it('checks if array of mixed rules as strings and functions is executed and returns proper error messages', () => {
    const mixedRules: Rules = ['required', (val: any) => (val !== 'foo' ? 'Sample error message' : '')]

    expect(validateRules(mixedRules, '')).toBe('Value can not be empty')
    expect(validateRules(mixedRules, 'bar')).toBe('Sample error message')
    expect(validateRules(mixedRules, 'foo')).toBe('')
  })

  it('checks if rules detects unknown rule', () => {
    const unknownRule: Rules = ['not_existing_rule']

    expect(validateRules(unknownRule, '')).toBe('Unknown rule not_existing_rule')
  })

  it('checks if parametrized rules are executed and returns proper error messages ', () => {
    const parametrizedRule: Rules = ['min:2']

    expect(validateRules(parametrizedRule, 'f')).toBe('Min length is: 2')
    expect(validateRules(parametrizedRule, 'foo')).toBe('')
  })

  it('checks if getErrorsStartingWith stripes unnecessary fields starting with given key ', () => {
    const errors: ValidationErrors = {
      'role_ids.1': 'This role_ids.1 field is invalid',
      'role_ids.2': 'This role_ids.2 field is invalid',
      'permission_ids.1': 'This permission_ids.1 field is invalid',
      'permission_ids.2': 'This permission_ids.2 field is invalid'
    }

    const expected = {
      'role_ids.1': 'This role_ids.1 field is invalid',
      'role_ids.2': 'This role_ids.2 field is invalid'
    }

    expect(getErrorsStartingWith('role_ids', errors)).toStrictEqual(expected)
  })

  it('checks if getChipError maps fields starting with given key to last one', () => {
    const errors: ValidationErrors = {
      'role_ids.1': 'This role_ids.1 field is invalid',
      'role_ids.2': 'This role_ids.2 field is invalid',
      'permission_ids.1': 'This permission_ids.1 field is invalid',
      'permission_ids.2': 'This permission_ids.2 field is invalid'
    }

    const expected = {
      '1': 'This role_ids.1 field is invalid',
      '2': 'This role_ids.2 field is invalid'
    }

    expect(getChipErrors('role_ids', errors)).toStrictEqual(expected)
  })
})

describe('Tests error helpers', () => {
  it('checks if mapError renames existing error fields', () => {
    const errors = {
      'translations.pl': 'foo',
      'translations.en': 'foo',
      'translations.he': 'foo',
      'name': 'bar'
    }
    const expected = {
      pl: 'foo',
      en: 'foo',
      he: 'foo',
      name: 'bar'
    }

    const mapped = mapErrors('translations.', '', errors)
    expect(mapped).toStrictEqual(expected)
  })

  it('checks if mapError does not map to empty fields', () => {
    const errors = {
      name: 'bar'
    }

    const mapped = mapErrors('name', '', errors)
    expect(mapped).toStrictEqual(errors)
  })

  it('returns section fields error on invalid fields', () => {
    const sections = {
      section_1: ['field_1', 'field_2'],
      section_2: ['field_3', 'field_4']
    }

    let errors = {
      field_1: 'Min length is: 2',
      field_2: '',
      field_3: 'Value can not be empty',
      field_4: ''
    }

    expect(getSectionErrors(sections, errors)).toStrictEqual({
      section_1: true,
      section_2: true
    })

    errors = {
      field_1: '',
      field_2: '',
      field_3: '',
      field_4: ''
    }

    expect(getSectionErrors(sections, errors)).toStrictEqual({
      section_1: false,
      section_2: false
    })

    errors = {
      field_1: 'Value can not be empty',
      field_2: 'Value can not be empty',
      field_3: '',
      field_4: ''
    }

    expect(getSectionErrors(sections, errors)).toStrictEqual({
      section_1: true,
      section_2: false
    })

    errors = {
      field_1: '',
      field_2: '',
      field_3: 'Value can not be empty',
      field_4: 'Value can not be empty'
    }

    expect(getSectionErrors(sections, errors)).toStrictEqual({
      section_1: false,
      section_2: true
    })
  })
})

describe('Tests generic rule generator', () => {
  it("Extends rules based on model's array content", () => {
    const model = {
      items: [{ foo: '' }, { foo: '' }, { foo: '' }]
    }

    const rules = {
      'items': ['required'],
      'items.*.foo': ['required']
    }

    const result = extendWildcardRules(model, rules)

    expect(result).toStrictEqual({
      'items': ['required'],
      'items.0.foo': ['required'],
      'items.1.foo': ['required'],
      'items.2.foo': ['required']
    })
  })
  it("Extends rules based on models's nested content", () => {
    const model = {
      items: {
        pl: { foo: '' },
        en: { foo: '' },
        he: { foo: '' }
      }
    }

    const rules = {
      'items': ['required'],
      'items.*.foo': ['required']
    }

    const result = extendWildcardRules(model, rules)

    expect(result).toStrictEqual({
      'items': ['required'],
      'items.pl.foo': ['required'],
      'items.en.foo': ['required'],
      'items.he.foo': ['required']
    })
  })

  it("Extends wildcard rules based on model's mixed content of deeply nested fields and arrays", () => {
    const model = {
      items: {
        pl: { foo: { nested_1: { items: [{ value: '' }, { value: '' }, { value: '' }] } } },
        en: { foo: { nested_2: { items: [{ value: '' }, { value: '' }] } } },
        he: { foo: { nested_3: { items: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }] } } }
      }
    }

    const rules = {
      'items': ['required'],
      'items.*.foo.*.items.*.value': ['required']
    }

    const result = extendWildcardRules(model, rules)

    expect(result).toStrictEqual({
      'items': ['required'],
      'items.pl.foo.nested_1.items.0.value': ['required'],
      'items.pl.foo.nested_1.items.1.value': ['required'],
      'items.pl.foo.nested_1.items.2.value': ['required'],
      'items.en.foo.nested_2.items.0.value': ['required'],
      'items.en.foo.nested_2.items.1.value': ['required'],
      'items.he.foo.nested_3.items.0.value': ['required'],
      'items.he.foo.nested_3.items.1.value': ['required'],
      'items.he.foo.nested_3.items.2.value': ['required'],
      'items.he.foo.nested_3.items.3.value': ['required']
    })
  })
})

describe('useValidator test use', () => {
  it('sets given errors', () => {
    const { errors, setErrors } = useValidator()
    const newErrors = {
      name: 'Value can not be empty',
      email: 'Value can not be empty'
    }

    setErrors(newErrors)

    expect(errors.value).toStrictEqual(newErrors)
  })

  it('sets given errors from API', () => {
    const { errors, setErrorsFromAPI } = useValidator()

    setErrorsFromAPI({
      name: ['Value can not be empty'],
      email: ['Value can not be empty', 'Name must be unique']
    })

    expect(errors.value).toStrictEqual({
      name: 'Value can not be empty',
      email: 'Value can not be empty'
    })
  })

  it("it sets valid/invalid state based on error's content", () => {
    const { isValid, setErrorsFromAPI } = useValidator()
    expect(isValid.value).toBeTrue()

    setErrorsFromAPI({
      name: ['Value can not be empty'],
      email: ['Value can not be empty', 'Name must be unique']
    })

    expect(isValid.value).toBeFalse()
  })

  it('it sets initial model as valid', () => {
    const { isValid } = useValidator({ name: '', email: '' })
    expect(isValid.value).toBeTrue()
  })

  it('it does not validate on unchanged model values', () => {
    const { isValid, validate, setModel } = useValidator({})

    const rules = {
      name: ['required']
    }

    setModel({})
    expect(isValid.value).toBeTrue()

    validate({}, rules)
    expect(isValid.value).toBeTrue()

    setModel({ name: '' })
    expect(isValid.value).toBeTrue()

    validate({ name: '' }, rules)
    expect(isValid.value).toBeTrue()
  })

  it('it validates model on changed values', () => {
    const { isValid, validate, setModel } = useValidator({ name: '', email: '' })
    const rules = {
      name: ['required'],
      email: ['nullable']
    }

    validate({ name: 'foo', email: '' }, rules)
    expect(isValid.value).toBeTrue()

    validate({ name: '', email: '' }, rules)
    expect(isValid.value).toBeFalse()

    validate({}, rules)
    expect(isValid.value).toBeFalse()

    setModel({ name: 'f', email: '' })
    validate({ name: '', email: '' }, rules)
    expect(isValid.value).toBeFalse()
  })

  it('it validates model on changed mixed values of nested fields and array items', () => {
    const model = {
      items: {
        pl: { foo: { nested_1: { items: [{ value: '' }, { value: '' }] } } }
      }
    }

    const { isValid, validate } = useValidator(model)

    const rules = {
      'items': ['required'],
      'items.*.foo.*.items.*.value': ['required']
    }

    let changedModel = {
      items: {
        pl: { foo: { nested_1: { items: [{ value: '' }, { value: 'bar' }] } } }
      }
    }
    validate(changedModel, rules)
    expect(isValid.value).toBeTrue()

    changedModel = {
      items: {
        pl: { foo: { nested_1: { items: [{ value: '' }, { value: '' }] } } }
      }
    }
    validate(changedModel, rules)
    expect(isValid.value).toBeFalse()
  })
})

describe('Test getting custom messages helper', () => {
  it('replaces default message with provided custom', () => {
    expect(getCustomMessageFallback('foo', 'bar')).toBe('bar')
  })
  it('returns default message without provided customs', () => {
    expect(getCustomMessageFallback('foo', '')).toBe('foo')
  })
})
