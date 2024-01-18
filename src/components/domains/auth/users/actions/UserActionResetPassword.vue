<template>
  <v-btn v-bind="$attrs" depressed color="primary" :loading="loading" @click="resetPasswordHandler">
    {{ $t('Reset password') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { isOverviewType } from '@/libs/isOverview'
import { useI18n } from 'vue-i18n-bridge'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useRoute } from '@/composable/migrateUseRoute'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserActionResetPassword',

  props: {
    value: {
      type: Object as PropType<Pick<User, 'email' | 'type'>>,
      required: true
    },
    redirectTo: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const { organisation } = route.params
    const isAdmin = props.value.type === 'admin'

    const api = useApi(isAdmin ? { organisation: Number(organisation), store: 0 } : undefined)

    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const getRedirectUrl = (): string => {
      const { protocol, hostname, port } = window.location
      const url = `${hostname}${port ? `:${port}` : ''}`

      if (!isOverviewType) {
        return `${protocol}//${url}`
      }

      const { currentOrganisation } = useOrganisations()

      return `${protocol}//${
        currentOrganisation.value?.domains?.console?.custom ||
        currentOrganisation.value?.domains?.console?.default ||
        url
      }`
    }

    const resetPasswordHandler = () => {
      loading.value = true
      emitLoadingState()

      api.auth
        .resetUserPassword(props.value.email, props.redirectTo || getRedirectUrl())
        .then((val) => {
          addSuccessToast(t('Password reset link has been sent'))
          emit('onSuccess', val)
        })
        .catch((err) => {
          addErrorToast(t('Unable to reset password'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      resetPasswordHandler
    }
  }
})
</script>
