import type { BaseCustomerGroups } from '@futureecom/futureecom-js/dist/services/customer-service'

export default (groups: BaseCustomerGroups[]): boolean => groups.map((item) => item.code).includes('b2b')
