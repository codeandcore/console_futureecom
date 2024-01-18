<template>
  <div>
    <tranzila-supplier v-model="payment" class="required" :error-messages="errors['supplier']" />
    <tranzila-terminal-password v-model="payment" class="required" :error-messages="errors['terminal_password']" />
    <tranzila-type v-model="payment" class="required" :error-messages="errors['type']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TranzilaSupplier from '@/components/domains/payments/providers/Tranzila/TranzilaSupplier.vue'
import TranzilaTerminalPassword from '@/components/domains/payments/providers/Tranzila/TranzilaTerminalPassword.vue'
import TranzilaType from '@/components/domains/payments/providers/Tranzila/TranzilaType.vue'
import type { PaymentTranzila } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentTranzilaInputs',

  components: { TranzilaType, TranzilaTerminalPassword, TranzilaSupplier },

  props: {
    value: {
      type: Object as PropType<PaymentTranzila>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const payment = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      payment
    }
  }
})
</script>
