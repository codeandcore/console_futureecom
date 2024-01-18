<template>
  <password-field v-bind="$attrs" v-model="password" :label="$t('Password')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PasswordField from '@/components/common/PasswordField.vue'
import type { PaymentConverge } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ConvergePassword',

  components: { PasswordField },

  props: {
    value: {
      type: Object as PropType<PaymentConverge>,
      required: true
    }
  },

  setup(props, { emit }) {
    const password = computed({
      get: () => props.value.password,
      set: (password) => emit('input', { ...props.value, password })
    })

    return {
      password
    }
  }
})
</script>
