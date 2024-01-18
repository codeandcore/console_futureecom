<template>
  <div>
    <poynt-business-id v-model="payment" class="required" :error-messages="errors['business_id']" />
    <poynt-store-id v-model="payment" class="required" :error-messages="errors['store_id']" />
    <poynt-application-id v-model="payment" class="required" :error-messages="errors['application_id']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PoyntApplicationId from '@/components/domains/payments/providers/Poynt/PoyntApplicationId.vue'
import PoyntBusinessId from '@/components/domains/payments/providers/Poynt/PoyntBusinessId.vue'
import PoyntStoreId from '@/components/domains/payments/providers/Poynt/PoyntStoreId.vue'
import type { PaymentPoyntTerminal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentPoyntTerminalInputs',

  components: { PoyntApplicationId, PoyntStoreId, PoyntBusinessId },

  props: {
    value: {
      type: Object as PropType<PaymentPoyntTerminal>,
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
