<template>
  <v-text-field v-bind="$attrs" v-model="privateKey" :label="$t('Private Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentBraintree } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BraintreePrivateKey',

  props: {
    value: {
      type: Object as PropType<PaymentBraintree>,
      required: true
    }
  },

  setup(props, { emit }) {
    const privateKey = computed({
      get: () => props.value.privateKey,
      set: (privateKey) => emit('input', { ...props.value, privateKey })
    })

    return {
      privateKey
    }
  }
})
</script>
