<template>
  <v-btn v-bind="$attrs" depressed :loading="loading" @click="generatePasswordHandler">
    {{ $t('Generate password') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserActionGeneratePassword',

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
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

    const generatePasswordHandler = () => {
      loading.value = true
      emitLoadingState()

      api.auth
        .generateUserPassword(props.value.id)
        .then((val) => {
          addSuccessToast(t('New password has been generated'))
          emit('onSuccess', val)
        })
        .catch((err) => {
          addErrorToast(t('Unable to generate new password'))
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
      generatePasswordHandler
    }
  }
})
</script>
