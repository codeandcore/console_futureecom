<template>
  <v-text-field v-bind="$attrs" v-model="publicKey" :label="$t('Public Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentBraintree } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BraintreePublicKey',

  props: {
    value: {
      type: Object as PropType<PaymentBraintree>,
      required: true
    }
  },

  setup(props, { emit }) {
    const publicKey = computed({
      get: () => props.value.publicKey,
      set: (publicKey) => emit('input', { ...props.value, publicKey })
    })

    return {
      publicKey
    }
  }
})
</script>
