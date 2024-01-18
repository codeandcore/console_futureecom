<template>
  <v-text-field v-bind="$attrs" v-model="merchantId" :label="$t('Merchant ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentBraintree } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BraintreeMerchantId',

  props: {
    value: {
      type: Object as PropType<PaymentBraintree>,
      required: true
    }
  },

  setup(props, { emit }) {
    const merchantId = computed({
      get: () => props.value.merchantId,
      set: (merchantId) => emit('input', { ...props.value, merchantId })
    })

    return {
      merchantId
    }
  }
})
</script>
