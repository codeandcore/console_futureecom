<template>
  <div v-if="loading.get" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>
  <div v-else-if="!loading.get && user" :key="user.updated_at" class="d-flex flex-column flex-gap-16">
    <user-password-change-inputs v-model="user" class="d-flex flex-column flex-gap-16" />

    <v-divider class="my-2" />
    <user-password-actions :value="user" class="d-flex flex-column flex-gap-16" :redirect-to="redirectTo" />
    <span class="grey--text text-caption">
      {{ $t('The store address for reset will be taken from Store configuration.') }}
      {{ $t('Make sure that it is correct') }}
    </span>
  </div>
  <div v-else class="d-flex justify-center grey--text">
    <span>{{ $t('User associated with this customer not found ') }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import UserPasswordActions from '@/components/domains/auth/users/actions/UserPasswordActions.vue'
import UserPasswordChangeInputs from '@/components/domains/auth/UserPasswordChangeInputs.vue'
import useApi from '@/composable/useApi'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'CustomerUserSecurity',

  components: {
    UserPasswordActions,
    UserPasswordChangeInputs
  },

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props) {
    const { addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const user = ref<User>()

    const loading = reactive({
      get: false,
      update: false
    })

    const store = useStores().currentStore

    const redirectTo = computed(() => {
      if (!store.value) {
        return ''
      }
      const { scheme, custom, default: defaultDomain } = store.value?.domain || {}
      return `${scheme}://${custom || defaultDomain}`
    })

    const getAssociatedUser = () => {
      loading.get = true
      api.auth
        .users({ filter: { customer_id: props.value.id } })
        .then((val) => (user.value = val.data[0]))
        .catch(() => addErrorToast(t('User associated with this customer not found')))
        .finally(() => (loading.get = false))
    }

    getAssociatedUser()

    return {
      user,
      loading,
      redirectTo
    }
  }
})
</script>
