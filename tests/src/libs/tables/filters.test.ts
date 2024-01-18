import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import {
  detectEmptyValueFilter,
  detectRule,
  filterRules,
  getEmptyValueFilter,
  getOperatorLabel,
  transformToApiParams,
  transformToValuedFilterDefinition,
  transformToVuetifyTableOptions
} from '@/libs/tables/filters'
import type { DataOptions } from 'vuetify'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { GridRequest } from '@futureecom/futureecom-js'

describe("Test for operator filters used with resource's grid", () => {
  const values = [
    { text: 'like', code: 'like' },
    { text: 'equals', code: 'eq' },
    { text: 'does not equal', code: 'neq' },
    { text: 'greater than', code: 'gt' },
    { text: 'less than', code: 'lt' },
    { text: 'greater or equal than', code: 'gte' },
    { text: 'equal or less than', code: 'lte' }
  ]

  it('returns proper filter operator label', () => {
    values.forEach((value) => {
      expect(getOperatorLabel(value.code)).toBe(value.text)
    })
  })

  it('returns filter operator as it was given', () => {
    expect(getOperatorLabel('foo')).toBe('foo')
  })

  it('finds the rule in the first level nested ', () => {
    Object.keys(filterRules).forEach((key) => {
      expect(detectRule({ [key]: { bar: 'xyz ' } })).toBe(key)
    })
  })
})

describe("Test for detecting rule existence in filters used with resource's grid", () => {
  it("doesn't find the rule in the first level nested ", () => {
    expect(detectRule({ foo: { bar: 'xyz ' } })).toBe(undefined)
  })

  it("doesn't find the rule on string value", () => {
    expect(detectRule('foobar')).toBe(undefined)
  })

  it("doesn't find the rule on empty arrays", () => {
    expect(detectRule([])).toBe(undefined)
  })

  it("doesn't find the rule on arrays", () => {
    expect(detectRule(['foobar'])).toBe(undefined)
  })

  it("doesn't find the rule on booleans", () => {
    expect(detectRule(true)).toBe(undefined)
    expect(detectRule(false)).toBe(undefined)
  })
})

describe("Test for detecting empty search behaviours for arrays and strings in advanced filters used with resource's grid", () => {
  it('detects if it returns "to not search" behaviour on nested object', () => {
    expect(detectEmptyValueFilter({ foo: { bar: 'xyz ' } })).toBe('undefined')
  })

  it('detects if it returns "to not search" behaviour on nested object with operator', () => {
    expect(detectEmptyValueFilter({ eq: 'xyz' })).toBe('undefined')
  })

  it('detects if it returns "search empty array" behaviour on empty array', () => {
    expect(detectEmptyValueFilter([])).toBe('[]')
  })

  it('detects if it returns "search empty array" behaviour on empty array with operator', () => {
    expect(detectEmptyValueFilter({ eq: [] })).toBe('[]')
  })

  it('detects if it returns "do not search value" behaviour on filled array', () => {
    expect(detectEmptyValueFilter(['value'])).toBe('undefined')
  })

  it('detects if it returns "do not search value" behaviour on filled array with operator', () => {
    expect(detectEmptyValueFilter({ eq: ['value'] })).toBe('undefined')
  })

  it('detects if it returns "search null value" behaviour on null value', () => {
    expect(detectEmptyValueFilter(null)).toBe('null')
  })

  it('detects if it returns "search null value" behaviour on null value with operator', () => {
    expect(detectEmptyValueFilter({ eq: null })).toBe('null')
  })

  it('detects if it returns "do not search value" behaviour on undefined value', () => {
    expect(detectEmptyValueFilter(undefined)).toBe('undefined')
  })

  it('detects if it returns "do not search value" behaviour on undefined value with operator', () => {
    expect(detectEmptyValueFilter({ eq: undefined })).toBe('undefined')
  })

  it('detects if it returns "search empty value" behaviour on empty string and undefined default empty value', () => {
    expect(detectEmptyValueFilter('')).toBe('undefined')
  })

  it('detects if it returns "search empty value" behaviour on empty string with operator and undefined default empty value', () => {
    expect(detectEmptyValueFilter({ eq: '' })).toBe('undefined')
  })
})

describe("Test for parsing search behaviours to values for arrays and strings in advanced filters used with resource's grid", () => {
  it('parses "search null value" to null value', () => {
    expect(getEmptyValueFilter(FilterEmptyValuesEnums.NULL)).toBe(null)
  })
  it('parses "do not search value value" to undefined value', () => {
    expect(getEmptyValueFilter(FilterEmptyValuesEnums.UNDEFINED)).toBe(undefined)
  })
  it('parses "search empty value" to given default empty value', () => {
    expect(getEmptyValueFilter(FilterEmptyValuesEnums.EMPTY_ARRAY)).toStrictEqual([])
  })
})

describe('Test transforming filters to unified format', () => {
  const definitions: FilterDefinition[] = [
    { type: 'text', code: 'name', label: 'Name' },
    {
      type: 'select-multiple',
      code: 'application',
      label: 'Application',
      options: [
        { text: 'Storefront', value: 'storefront' },
        { text: 'Point of Sale', value: 'pos' },
        { text: 'Console', value: 'console' },
        { text: 'API', value: 'api' }
      ]
    },
    { type: 'boolean', code: 'is_available', label: 'Is Available' },
    { type: 'range', code: 'quantity', label: 'Quantity' },
    { type: 'money-range', code: 'amount', label: 'Money Amount' },

    { type: 'date', code: 'created_at', label: 'Created At' }
  ]

  it('unifies unknown definition', () => {
    expect(transformToValuedFilterDefinition(['foo', 'bar'], definitions)).toStrictEqual({
      code: 'foo',
      value: undefined,
      label: 'foo',
      type: 'text'
    })
  })

  it('does not unify unknown definition with operator', () => {
    expect(transformToValuedFilterDefinition(['foo', { eq: 'bar' }], definitions)).toStrictEqual({
      code: 'foo',
      value: undefined,
      label: 'foo',
      type: 'text'
    })
  })

  it('unifies known definition with string value', () => {
    expect(transformToValuedFilterDefinition(['name', 'bar'], definitions)).toStrictEqual({
      code: 'name',
      value: 'bar',
      label: 'Name',
      type: 'text'
    })
  })

  it('unifies known definition with string value and existing operator', () => {
    expect(transformToValuedFilterDefinition(['name', { eq: 'bar' }], definitions)).toStrictEqual({
      code: 'name',
      value: 'equals bar',
      label: 'Name',
      type: 'text'
    })
  })

  it('unifies existing definition with stringified array value', () => {
    expect(transformToValuedFilterDefinition(['application', ['storefront', 'pos']], definitions)).toStrictEqual({
      code: 'application',
      label: 'Application',
      value: 'storefront, pos',
      options: [
        { text: 'Storefront', value: 'storefront' },
        { text: 'Point of Sale', value: 'pos' },
        { text: 'Console', value: 'console' },
        { text: 'API', value: 'api' }
      ],
      type: 'select-multiple'
    })
  })

  it('unifies existing definition with stringified array value and existing operator', () => {
    expect(
      transformToValuedFilterDefinition(['application', { like: ['storefront', 'pos'] }], definitions)
    ).toStrictEqual({
      code: 'application',
      label: 'Application',
      value: 'like storefront, pos',
      options: [
        { text: 'Storefront', value: 'storefront' },
        { text: 'Point of Sale', value: 'pos' },
        { text: 'Console', value: 'console' },
        { text: 'API', value: 'api' }
      ],
      type: 'select-multiple'
    })
  })

  it('unifies existing definition with stringified boolean value', () => {
    expect(transformToValuedFilterDefinition(['is_available', false], definitions)).toStrictEqual({
      code: 'is_available',
      label: 'Is Available',
      value: 'false',
      type: 'boolean'
    })
  })

  it('unifies existing definition with stringified boolean value', () => {
    expect(transformToValuedFilterDefinition(['is_available', false], definitions)).toStrictEqual({
      code: 'is_available',
      label: 'Is Available',
      value: 'false',
      type: 'boolean'
    })
  })

  it('unifies existing definition with ranged money value', () => {
    const value = { gte: { amount: '500', currency: 'USD' }, lte: { amount: '1000', currency: 'USD' } }
    expect(transformToValuedFilterDefinition(['amount', value], definitions)).toStrictEqual({
      code: 'amount',
      label: 'Money Amount',
      value,
      type: 'money-range'
    })
  })

  it('unifies existing definition with ranged number value', () => {
    const value = { gte: 700, lte: 1000 }
    expect(transformToValuedFilterDefinition(['quantity', value], definitions)).toStrictEqual({
      code: 'quantity',
      label: 'Quantity',
      value,
      type: 'range'
    })
  })

  it('unifies existing definition with ranged date value', () => {
    const value = { gte: '2023-07-21', lte: '2023-07-28' }
    expect(transformToValuedFilterDefinition(['created_at', value], definitions)).toStrictEqual({
      code: 'created_at',
      label: 'Created At',
      value,
      type: 'date'
    })
  })
})

describe("Test transforming grid's payload to Vuetify datatable object", () => {
  const initVuetifyOptions = {
    itemsPerPage: 10,
    page: 1,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false
  }

  it('transforms given params to Vuetify object with sorting descending', () => {
    const params: GridRequest = {
      sort: ['-value', 'foo']
    }

    const currentVuetifyOptions: DataOptions = { ...initVuetifyOptions }
    const expected = {
      ...initVuetifyOptions,
      sortBy: ['value', 'foo'],
      sortDesc: [true, false]
    }

    const result = transformToVuetifyTableOptions(params, currentVuetifyOptions)

    expect(result).toStrictEqual(expected)
  })
  it('transforms given params to Vuetify object with sorting ascending', () => {
    const params: GridRequest = {
      sort: ['value']
    }

    const currentVuetifyOptions: DataOptions = { ...initVuetifyOptions }
    const expected = {
      ...initVuetifyOptions,
      sortBy: ['value'],
      sortDesc: [false]
    }

    const result = transformToVuetifyTableOptions(params, currentVuetifyOptions)

    expect(result).toStrictEqual(expected)
  })

  it('transforms given params to Vuetify object with different page and perPage', () => {
    const params: GridRequest = { page: 4, perPage: 8 }

    const currentVuetifyOptions: DataOptions = { ...initVuetifyOptions }
    const expected = {
      ...initVuetifyOptions,
      page: 4,
      itemsPerPage: 8
    }

    const result = transformToVuetifyTableOptions(params, currentVuetifyOptions)

    expect(result).toStrictEqual(expected)
  })
})

describe("Test transforming Vuetify datatable object to grid's request object", () => {
  const initVuetifyOptions: DataOptions = {
    itemsPerPage: 10,
    page: 1,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false
  }

  it("transforms Vuetify datatable object to grid's request object correctly", () => {
    const vuetifyOptions: DataOptions = {
      ...initVuetifyOptions,
      sortBy: ['foo', 'bar'],
      sortDesc: [false, true],
      itemsPerPage: 8,
      page: 2
    }

    const expected: Pick<GridRequest, 'sort' | 'page' | 'perPage'> = {
      sort: ['foo', '-bar'],
      page: 2,
      perPage: 8
    }

    expect(transformToApiParams(vuetifyOptions)).toStrictEqual(expected)
  })
})
