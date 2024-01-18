<template>
  <v-text-field v-bind="$attrs" v-model="businessId" :label="$t('Business ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPoynt, PaymentPoyntTerminal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PoyntBusinessId',

  props: {
    value: {
      type: Object as PropType<PaymentPoynt | PaymentPoyntTerminal>,
      required: true
    }
  },

  setup(props, { emit }) {
    const businessId = computed({
      get: () => props.value.business_id,
      set: (business_id) => emit('input', { ...props.value, business_id })
    })

    return {
      businessId
    }
  }
})
</script>
