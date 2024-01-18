<template>
  <form-validator-wrapper @submit="onSubmit">
    <template #default="{ valid }">
      <span class="mx-4">{{ $t('Set new password') }}</span>
      <v-card-text :key="loading">
        <password-field
          v-model="password"
          :label="$t('New password')"
          :rules="rules.password"
          outlined
          hide-details="auto"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between ma-2 align-center">
        <div>
          <router-link :to="{ name: 'login' }">
            {{ $t('Remember password? Log in') }}
          </router-link>
        </div>
        <div>
          <v-btn depressed :disabled="!valid" :loading="loading" color="primary" type="submit" data-cy="submit-button">
            {{ $t('Reset password') }}
          </v-btn>
        </div>
      </v-card-actions>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { usePasswordRule } from '@/composable/validationRules'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PasswordField from '@/components/common/PasswordField.vue'
import useApi from '@/composable/useApi'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'PasswordReset',

  components: { PasswordField, FormValidatorWrapper },

  setup(_, { root }) {
    const loading = ref(false)

    const password = ref('')
    const rules = {
      password: [(val: string): ValidationRule => usePasswordRule(val)]
    }

    const onSubmit = (): void => {
      const api = useApi()
      const { token } = root.$route.params
      const { organisationId: organisation, storeId: store } = api.config

      if (organisation === undefined || !token) {
        return
      }

      loading.value = true

      api
        .usingStore({ organisation, id: store || 0 })
        .auth.changePassword(token, { password: password.value, password_confirmation: password.value })
        .then(() => {
          root.$toast.addSuccessToast(root.$t('Password changed. You can now log in'))
          root.$router.push({ name: 'login' })
        })
        .catch((err: any) => root.$toast.addErrorToast(err.response.data.message))
        .finally(() => (loading.value = false))
    }

    return {
      loading,
      rules,
      password,
      onSubmit
    }
  }
})
</script>
