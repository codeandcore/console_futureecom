<template>
  <v-form @submit.prevent="onSubmit">
    <span class="mx-4">{{ $t('Password reset') }}</span>
    <v-card-text :key="loading">
      <v-text-field
        v-model="email"
        :label="$t('Email')"
        :error-messages="errors['email']"
        outlined
        hide-details="auto"
        @input="onItemChange"
      />
    </v-card-text>

    <v-card-actions class="d-flex justify-space-between ma-2 align-center">
      <div>
        <router-link :to="{ name: 'login' }">
          {{ $t('Remember password? Log in') }}
        </router-link>
      </div>
      <div>
        <v-btn depressed :disabled="!isValid" :loading="loading" color="primary" type="submit" data-cy="submit-button">
          {{ $t('Send reset link') }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'ForgotPassword',

  setup() {
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)

    const email = ref('')

    const { errors, isValid, validate } = useValidator()

    const rules: RuleDefinitions = { email: ['required', 'email'] }

    const onItemChange = () => validate({ email: email.value }, rules)

    const onSubmit = (): void => {
      validate({ email: email.value }, rules, true)
      if (!isValid.value) {
        return
      }

      const api = useApi()
      const { organisationId: organisation, storeId: store } = api.config

      if (organisation === undefined) {
        return
      }

      loading.value = true

      const { protocol, hostname, port } = window.location
      const urlPort = port ? `:${port}` : ''

      const redirectUrl = `${protocol}//${hostname}${urlPort}`

      api
        .usingStore({ organisation, id: store || 0 })
        .auth.resetUserPassword(email.value, redirectUrl)
        .then(({ message }) => {
          addSuccessToast(message)
          email.value = ''
        })
        .catch((err: any) => addErrorToast(err.response.data.message))
        .finally(() => (loading.value = false))
    }

    return {
      loading,
      email,
      errors,
      isValid,
      onSubmit,
      onItemChange
    }
  }
})
</script>
