<template>
  <v-form class="d-flex flex-column flex-gap-16" @submit.prevent="savePasswordHandler">
    <v-alert
      :value="value.require_password_change"
      type="warning"
      class="text-caption"
      dismissible
      transition="fade-transition"
    >
      {{ $t('User has been requested to change password on first login attempt.') }}
    </v-alert>

    <user-require-password-change v-model="passwordChange" />

    <user-password
      v-model="passwordChange"
      v-bind="$attrs"
      :error-messages="errors['password']"
      @input="onUpdatePasswordChange"
    />

    <div class="d-flex justify-end">
      <v-btn small depressed color="primary" type="submit" :disabled="!isValid" :loading="loading">
        {{ $t('Save new password') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import UserPassword from '@/components/domains/auth/users/UserPassword.vue'
import UserRequirePasswordChange from '@/components/domains/auth/users/UserRequirePasswordChange.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserPasswordChangeInputs',

  components: {
    UserPassword,
    UserRequirePasswordChange
  },

  inheritAttrs: false,

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

    const loading = ref(false)

    const passwordChange = ref({ password: '', require_password_change: props.value.require_password_change })

    const { isValid, validate, errors, setErrorsFromAPI } = useValidator()

    const updatePasswordRules: RuleDefinitions = { password: ['required', 'string', 'min:8'] }
    const onUpdatePasswordChange = () => validate(passwordChange.value, updatePasswordRules)

    const savePasswordHandler = () => {
      validate(passwordChange.value, updatePasswordRules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      const payload = {
        password: passwordChange.value.password,
        require_password_change: passwordChange.value.require_password_change,
        password_confirmation: passwordChange.value.password
      }

      const apiTenancy = {
        organisation: Number(route.params.organisation),
        store: props.value.type !== 'customer' ? 0 : Number(route.params.store)
      }

      useApi(apiTenancy)
        .auth.updateUser(props.value.id, payload)
        .then((value) => {
          addSuccessToast(t("User's password has been updated"))
          emit('input', value)
        })
        .catch((err) => {
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      passwordChange,
      isValid,
      errors,
      loading,
      onUpdatePasswordChange,
      savePasswordHandler
    }
  }
})
</script>
