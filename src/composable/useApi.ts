import { api } from '@/libs/api'
import { useRoute } from '@/composable/migrateUseRoute'
import type FutureEcom from '@futureecom/futureecom-js'

export default (resource?: { organisation: number; store?: number }): FutureEcom => {
  const route = useRoute()

  if (resource && resource.store !== undefined) {
    return api.usingStore({
      organisation: resource.organisation,
      id: resource.store
    })
  }

  if (resource) {
    return api.usingOrganisation(resource.organisation)
  }

  const params = route?.params || {}

  const organisation = params.organisation === '' ? -1 : Number(params.organisation)
  const store = params.store === '' ? -1 : Number(params.store)

  if (organisation >= 0 && store >= 0) {
    return api.usingStore({
      organisation: organisation,
      id: store
    })
  }

  if (organisation >= 0) {
    return api.usingOrganisation(organisation)
  }

  return api
}
