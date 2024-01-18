<template>
  <div>
    <poynt-is-eu-territory v-model="payment" />
    <poynt-business-id v-model="payment" class="required" :error-messages="errors['business_id']" />
    <poynt-store-id v-model="payment" class="required" :error-messages="errors['store_id']" />
    <poynt-application-id v-model="payment" class="required" :error-messages="errors['application_id']" />
    <poynt-private-key v-model="payment" class="required" :error-messages="errors['private_key']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PoyntApplicationId from '@/components/domains/payments/providers/Poynt/PoyntApplicationId.vue'
import PoyntBusinessId from '@/components/domains/payments/providers/Poynt/PoyntBusinessId.vue'
import PoyntIsEuTerritory from '@/components/domains/payments/providers/Poynt/PoyntIsEuTerritory.vue'
import PoyntPrivateKey from '@/components/domains/payments/providers/Poynt/PoyntPrivateKey.vue'
import PoyntStoreId from '@/components/domains/payments/providers/Poynt/PoyntStoreId.vue'
import type { PaymentPoynt } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentPoyntInputs',

  components: { PoyntPrivateKey, PoyntApplicationId, PoyntStoreId, PoyntBusinessId, PoyntIsEuTerritory },
  props: {
    value: {
      type: Object as PropType<PaymentPoynt>,
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
