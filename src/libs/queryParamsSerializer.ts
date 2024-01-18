import { parse, stringify } from 'qs'

const filter = (prefix: string, value: any) => {
  if (Array.isArray(value) && !value.length) {
    return '[]'
  }
  if (value === null) {
    return 'null'
  }

  return value
}

export const stringifyQueryParams = <T extends object>(params: T): string => {
  return stringify(params, { arrayFormat: 'indices', encode: false, filter })
}

export const parseQueryParams = (params: string) => {
  return parse(params) as Record<string, string>
}
