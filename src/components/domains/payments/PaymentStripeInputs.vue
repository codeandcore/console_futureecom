<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <stripe-api-key v-model="payment" class="required" :error-messages="errors['apiKey']" />
    <stripe-publishable-key v-model="payment" class="required" :error-messages="errors['publishableKey']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import StripeApiKey from '@/components/domains/payments/providers/Stripe/StripeApiKey.vue'
import StripePublishableKey from '@/components/domains/payments/providers/Stripe/StripePublishableKey.vue'
import type { PaymentStripe } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentStripeInputs',
  components: { PaymentMethodProviderTestMode, StripeApiKey, StripePublishableKey },
  props: {
    value: {
      type: Object as PropType<PaymentStripe>,
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
