<template>
  <v-text-field
    v-bind="$attrs"
    v-model="tokenizationKey"
    :label="$t('Tokenization Key')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentBraintree } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BraintreeTokenizationKey',

  props: {
    value: {
      type: Object as PropType<PaymentBraintree>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tokenizationKey = computed({
      get: () => props.value.tokenizationKey,
      set: (tokenizationKey) => emit('input', { ...props.value, tokenizationKey })
    })

    return {
      tokenizationKey
    }
  }
})
</script>
