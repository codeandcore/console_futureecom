<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <paypal-client-id v-model="payment" class="required" :error-messages="errors['clientId']" />
    <paypal-secret v-model="payment" class="required" :error-messages="errors['secret']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import PaypalClientId from '@/components/domains/payments/providers/Paypal/PaypalClientId.vue'
import PaypalSecret from '@/components/domains/payments/providers/Paypal/PaypalSecret.vue'
import type { PaymentPaypal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentPaypalInputs',
  components: { PaymentMethodProviderTestMode, PaypalSecret, PaypalClientId },
  props: {
    value: {
      type: Object as PropType<PaymentPaypal>,
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
