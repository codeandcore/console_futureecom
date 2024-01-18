import { computed, ref } from '@vue/composition-api'
import { isOverviewType } from '@/libs/isOverview'
import useApi from '@/composable/useApi'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { UserUpdateRequest } from '@futureecom/futureecom-js/dist/services/auth-service'

const user = ref<User>()

export const useMyAccount = () => {
  const api = useApi()
  const userApi = useApi({ organisation: isOverviewType ? 0 : api.config.organisationId || 1, store: 0 })

  const setUser = (val: User) => (user.value = val)

  const fetchMyAccount = () => userApi.auth.getUser('me').then(setUser)
  const updateMyAccount = (data: UserUpdateRequest) => userApi.auth.updateUser('me', data).then(setUser)

  return {
    fetchMyAccount,
    updateMyAccount,
    myAccount: user,
    myAccountId: computed(() => (user.value ? user.value.id : ''))
  }
}
