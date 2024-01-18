<template>
  <div>
    <cardknox-x-key v-model="payment" class="required" :error-messages="errors['xKey']" />
    <cardknox-i-fields-key v-model="payment" class="required" :error-messages="errors['iFieldsKey']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CardknoxIFieldsKey from '@/components/domains/payments/providers/Cardknox/CardknoxIFieldsKey.vue'
import CardknoxXKey from '@/components/domains/payments/providers/Cardknox/CardknoxXKey.vue'
import type { PaymentCardknox } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentCardknoxInputs',
  components: { CardknoxIFieldsKey, CardknoxXKey },
  props: {
    value: {
      type: Object as PropType<PaymentCardknox>,
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
