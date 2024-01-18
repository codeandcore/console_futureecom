<template>
  <div>
    <login-username v-model="credentials" :rules="rules.username" />
    <login-password v-model="credentials" :rules="rules.password" />
  </div>
</template>

<script lang="ts">
import { ValidationRule, useEmailValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { computed, defineComponent } from '@vue/composition-api'
import LoginPassword from '@/components/login/LoginPassword.vue'
import LoginUsername from '@/components/login/LoginUsername.vue'
import type { PropType } from '@vue/composition-api'
import type { TokenRequestPassword } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'LoginInputs',
  components: { LoginPassword, LoginUsername },

  props: {
    value: {
      type: Object as PropType<TokenRequestPassword>,
      required: true
    }
  },

  setup(props, { emit }) {
    const credentials = computed({
      get: () => props.value,
      set: (credentials) => emit('input', credentials)
    })

    const rules = {
      username: [
        (email: string): ValidationRule => useNotEmptyValidationRule(email),
        (email: string): ValidationRule => useEmailValidationRule(email)
      ],
      password: [(password: string): ValidationRule => useNotEmptyValidationRule(password)]
    }

    return {
      credentials,
      rules
    }
  }
})
</script>
