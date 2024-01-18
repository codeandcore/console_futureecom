<template>
  <v-text-field v-bind="$attrs" v-model="apiKey" :label="$t('API Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentStripe } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'StripeApiKey',

  props: {
    value: {
      type: Object as PropType<PaymentStripe>,
      required: true
    }
  },

  setup(props, { emit }) {
    const apiKey = computed({
      get: () => props.value.apiKey,
      set: (apiKey) => emit('input', { ...props.value, apiKey })
    })

    return {
      apiKey
    }
  }
})
</script>
