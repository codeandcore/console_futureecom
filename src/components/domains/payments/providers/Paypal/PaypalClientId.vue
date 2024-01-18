<template>
  <v-text-field v-bind="$attrs" v-model="clientId" :label="$t('Client ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPaypal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaypalClientId',

  props: {
    value: {
      type: Object as PropType<PaymentPaypal>,
      required: true
    }
  },

  setup(props, { emit }) {
    const clientId = computed({
      get: () => props.value.clientId,
      set: (clientId) => emit('input', { ...props.value, clientId })
    })

    return {
      clientId
    }
  }
})
</script>
