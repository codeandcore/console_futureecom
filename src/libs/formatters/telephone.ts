import type { Telephone } from '@futureecom/futureecom-js'

export const formatTelephone = (telephone: Telephone): string => {
  return telephone.prefix ? `+${telephone.prefix} ${telephone.number}` : `${telephone.number}`
}
