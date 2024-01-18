import { isObject } from '@/libs/objects'
import dayjs from 'dayjs'
import type { DateRange } from '@/types/libs/domains/report/formatters'

export const formatCodeToHumanText = (code: string) => {
  return code.replaceAll('.', ' ').replaceAll('_', ' ')
}

export const splitReportSort = (val: string): { separator?: string; split: string[] } => {
  const separator = ['avg', 'max', 'min', 'sum'].find((part) => val.includes(`.${part}`))

  if (!separator) {
    return { separator, split: [val] }
  }

  const [prefix, totals] = val.split(`.${separator}`)

  return {
    separator,
    split: [prefix, totals.replaceAll('.', '')]
  }
}

const DATE_FORMAT = 'YYYY-MM-DD'

export const getDateRange = (unit: 'month' | 'year', moveBy = 0): DateRange => {
  return {
    gte: dayjs().add(moveBy, unit).startOf(unit).format(DATE_FORMAT),
    lte: dayjs().add(moveBy, unit).endOf(unit).format(DATE_FORMAT)
  }
}

export const stringifyRange = (range: unknown) => {
  const hasGte = (val: unknown): val is { gte: string } => isObject(val) && 'gte' in val
  const hasLte = (val: unknown): val is { lte: string } => isObject(val) && 'lte' in val

  if (!isObject(range)) {
    return ''
  }

  return [hasGte(range) ? range.gte : '', hasLte(range) ? range.lte : ''].filter(Boolean).join(' - ')
}
