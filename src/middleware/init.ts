import { accessToken, configureApi, isSuperAdmin } from '@/libs/api'
import { getClientId, getOrganisationId } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useStores } from '@/composable/repositories/useStores'
import type { NavigationGuardNext, Route } from 'vue-router'

export default async (to: Route, from: Route, next: NavigationGuardNext): Promise<void> => {
  const clientId: string | undefined = getClientId(accessToken.value)
  const tokenOrg: number | undefined = getOrganisationId(accessToken.value)

  configureApi(clientId, tokenOrg)

  if (isSuperAdmin.value && tokenOrg === 0) {
    await useOrganisations().fetchOrganisations()
  } else {
    await useStores().fetchStores(Number(to.params.organisation))
  }

  next()
}
