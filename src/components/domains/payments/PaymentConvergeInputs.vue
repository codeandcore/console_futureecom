<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <converge-merchant-id v-model="payment" class="required" :error-messages="errors['merchantId']" />
    <converge-username v-model="payment" class="required" :error-messages="errors['username']" />
    <converge-password v-model="payment" class="required" :error-messages="errors['password']" />
    <converge-integration-testing v-model="payment" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ConvergeIntegrationTesting from '@/components/domains/payments/providers/Converge/ConvergeIntegrationTesting.vue'
import ConvergeMerchantId from '@/components/domains/payments/providers/Converge/ConvergeMerchantId.vue'
import ConvergePassword from '@/components/domains/payments/providers/Converge/ConvergePassword.vue'
import ConvergeUsername from '@/components/domains/payments/providers/Converge/ConvergeUsername.vue'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import type { PaymentConverge } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentConvergeInputs',

  components: {
    PaymentMethodProviderTestMode,
    ConvergeIntegrationTesting,
    ConvergePassword,
    ConvergeUsername,
    ConvergeMerchantId
  },

  props: {
    value: {
      type: Object as PropType<PaymentConverge>,
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
