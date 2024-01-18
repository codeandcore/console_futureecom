import { transformQuery } from '@/libs/transformQuery'

export const filterRouteQuery = (prefix: string, value: unknown) => {
  return transformQuery(value, { returnSource: true, emptyArrayString: true, nullString: true })
}
