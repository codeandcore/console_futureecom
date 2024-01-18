export enum FilterEmptyValuesEnums {
  NULL = 'null',
  UNDEFINED = 'undefined',
  EMPTY_ARRAY = '[]'
}

export type FilterEmptyValue = '' | 0 | null | undefined | [] | false

export interface AdvancedFilters {
  rule?: string
  behaviour: FilterEmptyValuesEnums
}

export type MathOperator = string | 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte'

export type FilterRangeType = 'range' | 'money-range' | 'date'
export type FilterTextType = 'text' | 'boolean' | FilterRangeType
export type FilterSelectType = 'select-multiple' | 'array'

export interface FilterTextDefinition<Code = unknown> {
  type: FilterTextType
  code: Code
  label: string
}

export interface FilterSelectDefinition<Code = unknown> {
  type: FilterSelectType
  code: Code
  label: string
  options?: ({ text: string; value: string } | string)[]
}

export type FilterDefinition<Code = unknown> = FilterTextDefinition<Code> | FilterSelectDefinition<Code>

export type Filter = Record<string, any>

export interface FilterRange {
  gte?: string
  lte?: string
}

export type FilterChip = FilterDefinition<unknown> & { value: unknown }
