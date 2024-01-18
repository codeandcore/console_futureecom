<template>
  <div class="d-flex justify-space-between flex-wrap flex-gap-16 flex-sm-row-reverse">
    <user-action-generate-password small :value="value" :loading.sync="loading.generate" :disabled="loading.reset" />
    <user-action-reset-password
      small
      :value="value"
      :loading.sync="loading.reset"
      :disabled="loading.generate"
      :redirect-to="redirectTo"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import { reactive } from '@vue/composition-api'
import UserActionGeneratePassword from '@/components/domains/auth/users/actions/UserActionGeneratePassword.vue'
import UserActionResetPassword from '@/components/domains/auth/users/actions/UserActionResetPassword.vue'
import type { PropType } from '@vue/composition-api'
import type { UserResponse } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserActionsPasswordActions',
  components: { UserActionResetPassword, UserActionGeneratePassword },
  props: {
    value: {
      type: Object as PropType<UserResponse>,
      required: true
    },
    redirectTo: {
      type: String,
      default: undefined
    }
  },

  setup() {
    const loading = reactive({
      generate: false,
      reset: false
    })

    return {
      loading
    }
  }
})
</script>
