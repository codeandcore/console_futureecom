<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <braintree-merchant-id v-model="payment" class="required" :error-messages="errors['merchantId']" />
    <braintree-tokenization-key v-model="payment" class="required" :error-messages="errors['tokenizationKey']" />
    <braintree-public-key v-model="payment" class="required" :error-messages="errors['publicKey']" />
    <braintree-private-key v-model="payment" class="required" :error-messages="errors['privateKey']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import BraintreeMerchantId from '@/components/domains/payments/providers/Braintree/BraintreeMerchantId.vue'
import BraintreePrivateKey from '@/components/domains/payments/providers/Braintree/BraintreePrivateKey.vue'
import BraintreePublicKey from '@/components/domains/payments/providers/Braintree/BraintreePublicKey.vue'
import BraintreeTokenizationKey from '@/components/domains/payments/providers/Braintree/BraintreeTokenizationKey.vue'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import type { PaymentBraintree } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentBraintreeInputs',

  components: {
    PaymentMethodProviderTestMode,
    BraintreePrivateKey,
    BraintreeTokenizationKey,
    BraintreePublicKey,
    BraintreeMerchantId
  },

  props: {
    value: {
      type: Object as PropType<PaymentBraintree>,
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
