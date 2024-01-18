<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <payment-method-provider-auto-pay v-model="payment" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PaymentMethodProviderAutoPay from '@/components/domains/payments/providers/common/PaymentMethodProviderAutoPay.vue'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import type { PaymentOffline } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentOfflineInputs',

  components: { PaymentMethodProviderAutoPay, PaymentMethodProviderTestMode },

  props: {
    value: {
      type: Object as PropType<PaymentOffline>,
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
