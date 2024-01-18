<template>
  <v-text-field v-bind="$attrs" v-model="xKey" :label="$t('xKey')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentCardknox, PaymentCardknoxPOS } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CardknoxXKey',

  props: {
    value: {
      type: Object as PropType<PaymentCardknox | PaymentCardknoxPOS>,
      required: true
    }
  },

  setup(props, { emit }) {
    const xKey = computed({
      get: () => props.value.xKey,
      set: (xKey) => emit('input', { ...props.value, xKey })
    })

    return {
      xKey
    }
  }
})
</script>
