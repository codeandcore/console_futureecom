<template>
  <div class="d-flex flex-column flex-gap-16">
    <customer-password-require-change v-model="customer" />
    <user-password v-model="customer" :rules="rules.password" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { usePasswordRule } from '@/composable/validationRules'
import CustomerPasswordRequireChange from '@/components/domains/customers/customer/CustomerPasswordRequireChange.vue'
import UserPassword from '@/components/domains/auth/users/UserPassword.vue'
import type { BaseCustomer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CustomerSecurity',

  components: { UserPassword, CustomerPasswordRequireChange },

  props: {
    value: {
      type: Object as PropType<BaseCustomer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const customer = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      password: [(val: string): ValidationRule => usePasswordRule(val)]
    }

    return {
      customer,
      rules
    }
  }
})
</script>
