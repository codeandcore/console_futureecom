import { isItemGroupedByNested } from '@/libs/domains/report/guards'
import type { SalesReportGroupedBy } from '@futureecom/futureecom-js/dist/services/order-service'

export const findReportDetails = <T extends { grouped_by: SalesReportGroupedBy }>(
  data: T[],
  groups?: Record<string, unknown>
): T | undefined => {
  return data.find(({ grouped_by: itemGroupedBy }) => {
    if (!isItemGroupedByNested(groups) || !isItemGroupedByNested(itemGroupedBy)) {
      return [`${Object.values(groups || {})}`, 'null'].includes(`${itemGroupedBy}`)
    }

    return Object.entries(groups || {}).every(([key, value]) => {
      return [`${value}`, ''].includes(`${itemGroupedBy[key]}`)
    })
  })
}
