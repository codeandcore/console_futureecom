import { accessToken } from '@/libs/api'
import { computed } from '@vue/composition-api'
import { permissionChecker } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { useStores } from '@/composable/repositories/useStores'

const { currentStore } = useStores()

export const can = (scope: string[], org?: string, store?: string) => {
  return computed((): boolean => {
    const { organisation_code, code } = currentStore.value || {}

    const organisationCode = org || organisation_code
    const storeCode = store || code

    return scope.every((s) => permissionChecker(accessToken.value, s, organisationCode, storeCode))
  })
}

export const canAny = (scope: string[], org?: string, store?: string) => {
  return computed((): boolean => {
    const { organisation_code, code } = currentStore.value || {}

    const organisationCode = org || organisation_code
    const storeCode = store || code

    return scope.some((s) => permissionChecker(accessToken.value, s, organisationCode, storeCode))
  })
}
