<template>
  <v-text-field v-bind="$attrs" v-model="secret" :label="$t('Secret Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPaypal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaypalSecret',

  props: {
    value: {
      type: Object as PropType<PaymentPaypal>,
      required: true
    }
  },

  setup(props, { emit }) {
    const secret = computed({
      get: () => props.value.secret,
      set: (secret) => emit('input', { ...props.value, secret })
    })

    return {
      secret
    }
  }
})
</script>
