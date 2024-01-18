import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import { isObject } from '@/libs/objects'
import { transformQuery } from '@/libs/transformQuery'
import type { DataOptions } from 'vuetify'
import type { Filter, FilterChip, FilterDefinition, FilterEmptyValue } from '@/types/FilterDefinitions'
import type { FilterRequest, GridRequest } from '@futureecom/futureecom-js'

export const filterRules: Record<string, string> = {
  like: 'like',
  all: 'all',
  eq: 'equals',
  neq: 'does not equal',
  gt: 'greater than',
  lt: 'less than',
  gte: 'greater or equal than',
  lte: 'equal or less than'
}

export const getOperatorLabel = (value: string): string => filterRules[value] || value

const hasExistingRule = (val: string): val is keyof Required<FilterRequest> => val in filterRules

export const detectRule = (val: any | Filter): keyof Required<FilterRequest> | undefined => {
  if (typeof val === 'string' || Array.isArray(val)) {
    return undefined
  }

  const key = Object.keys(val || {})[0]
  return hasExistingRule(key) ? key : undefined
}

export const detectEmptyValueFilter = (val: any): FilterEmptyValuesEnums => {
  const rule = detectRule(val)
  const value = rule ? val[rule] : val

  if (Array.isArray(value) && !value.length) {
    return FilterEmptyValuesEnums.EMPTY_ARRAY
  }

  if (value === null) {
    return FilterEmptyValuesEnums.NULL
  }

  return FilterEmptyValuesEnums.UNDEFINED
}

export const getEmptyValueFilter = (value: FilterEmptyValuesEnums): FilterEmptyValue => {
  if (value === FilterEmptyValuesEnums.NULL) {
    return null
  }

  if (value === FilterEmptyValuesEnums.EMPTY_ARRAY) {
    return []
  }

  return undefined
}

export const transformToValuedFilterDefinition = (
  [key, value]: [string, unknown],
  definitions: FilterDefinition[]
): FilterChip => {
  const definition = definitions.find((item) => item.code === key)

  if (!definition) {
    return { code: key, value: undefined, label: key, type: 'text' }
  }

  if (['date', 'range', 'money-range'].includes(definition.type)) {
    return { ...definition, value }
  }

  const rule: string | undefined = detectRule(value)

  const options = { emptyString: true, emptyArrayString: true }

  const valueToFlatten = rule && isObject(value) ? value[rule] : value

  const flattenedValue = rule
    ? `${getOperatorLabel(rule)} ${transformQuery(valueToFlatten, options)}`
    : transformQuery(valueToFlatten, options)

  return { ...definition, value: `${flattenedValue}`.replaceAll(',', ', ') }
}

export const transformToVuetifyTableOptions = (params: GridRequest, currentOptions: DataOptions) => {
  const sort = Array.from(params.sort || [])
  const sortDesc: boolean[] = []
  const sortBy: string[] = []

  sort.forEach((item) => {
    const split = item.split('-')
    sortDesc.push(split.length > 1)
    sortBy.push(split[split.length - 1])
  })

  return {
    ...currentOptions,
    page: Number(params.page || currentOptions.page),
    itemsPerPage: Number(params.perPage || currentOptions.itemsPerPage),
    sortBy,
    sortDesc
  }
}

export const transformToApiParams = (options: DataOptions): Pick<GridRequest, 'sort' | 'page' | 'perPage'> => {
  const { page, itemsPerPage: perPage, sortBy, sortDesc } = options
  const sort = (sortBy || []).map((item, index) => (sortDesc[index] ? `-${item}` : item))

  return {
    sort: sort.length ? sort : undefined,
    page,
    perPage
  }
}

export const combineFilters = <T = any>(...args: FilterDefinition<T>[][]): FilterDefinition<T>[] => {
  const combined = args.reduce((prev, curr) => {
    return [...prev, ...curr]
  })

  return combined.reduce((prev, curr) => {
    return curr.code && !curr.label ? prev.filter((item) => item.code !== curr.code) : prev
  }, combined)
}
