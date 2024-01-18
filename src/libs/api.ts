import { TOKEN } from '@/config/env'
import { computed, ref } from '@vue/composition-api'
import { getApiConfig, tokenDriverInstance } from '@/libs/api/config'
import { getUserType } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import type { Token } from '@futureecom/futureecom-js'
import type FutureEcom from '@futureecom/futureecom-js'

const userType = computed(() => getUserType(accessToken.value))
export const isSuperAdmin = computed<boolean>(() => userType.value === 'super_admin')

/** @deprecated tokenRef will not be exported directly in the future. **/
export const tokenRef = ref<Token>(tokenDriverInstance.get(TOKEN.ACCESS_TOKEN_KEY))

/** @deprecated refreshTokenRef will not be exported directly in the future. **/
export const refreshTokenRef = ref<Token>(tokenDriverInstance.get(TOKEN.REFRESH_TOKEN_KEY))

/** @deprecated accessToken will not be exported directly in the future. Prefer using methods - useCrudChecker or can/canAny for permissions.  **/
export const accessToken = computed<string>(() => tokenRef.value || '')

/** @deprecated refreshToken will not be exported directly in the future. **/
export const refreshToken = computed<string>(() => refreshTokenRef.value || '')

/** @deprecated refreshTenancyKeys will not be exported directly in the future. **/
export const refreshTenancyKeys = computed({
  get: () => {
    const [organisation, store] = (tokenDriverInstance.get(TOKEN.REFRESH_TENANCY_KEY) || '').split('-')
    return {
      organisation: Number(organisation || 0),
      store: store ? Number(store) : undefined
    }
  },
  set: (value: { organisation?: number; store?: number }) => {
    if (value.organisation !== undefined) {
      tokenDriverInstance.set(TOKEN.REFRESH_TENANCY_KEY, `${value.organisation}-${value.store || ''}`)
    }
  }
})

export let api: FutureEcom

export const configureApi = (clientId?: string, organisation?: number) => {
  api = getApiConfig(clientId, organisation)
}

configureApi()
