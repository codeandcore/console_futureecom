<template>
  <v-text-field
    v-bind="$attrs"
    v-model="terminalPassword"
    :label="$t('Terminal Password')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentTranzila } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TranzilaTerminalPassword',

  props: {
    value: {
      type: Object as PropType<PaymentTranzila>,
      required: true
    }
  },

  setup(props, { emit }) {
    const terminalPassword = computed({
      get: () => props.value.terminal_password,
      set: (terminal_password) => emit('input', { ...props.value, terminal_password })
    })

    return {
      terminalPassword
    }
  }
})
</script>
