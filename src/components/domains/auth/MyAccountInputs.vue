<template>
  <div>
    <user-name v-model="user" :rules="rules.name" />
    <user-email v-model="user" :rules="rules.email" />
    <user-password v-model="user" :rules="rules.password" />
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/composition-api'
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import { useEmailValidationRule, useNotEmptyValidationRule, usePasswordRule } from '@/composable/validationRules'
import UserEmail from '@/components/domains/auth/users/UserEmail.vue'
import UserName from '@/components/domains/auth/users/UserName.vue'
import UserPassword from '@/components/domains/auth/users/UserPassword.vue'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'MyAccountInputs',

  components: { UserPassword, UserEmail, UserName },

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    }
  },

  setup(props, { emit }) {
    const user = computed({
      get: () => props.value,
      set: (user) => emit('input', user)
    })

    const rules = {
      name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      email: [
        (val: string): ValidationRule => useNotEmptyValidationRule(val),
        (val: string): ValidationRule => useEmailValidationRule(val)
      ],
      password: [(val: string): ValidationRule => !val || usePasswordRule(val)]
    }

    return {
      user,
      rules
    }
  }
})
</script>
