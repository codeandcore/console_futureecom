import { api } from '@/libs/api'
import { getUserFromToken } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import type { NavigationGuardNext, Route } from 'vue-router'

export default (to: Route, from: Route, next: NavigationGuardNext): void => {
  const profileType = getUserFromToken(api.config.accessToken)?.profile.type

  if (!profileType || !['admin', 'super_admin'].includes(profileType)) {
    next({ name: 'login' })
    return
  }

  next()
}
