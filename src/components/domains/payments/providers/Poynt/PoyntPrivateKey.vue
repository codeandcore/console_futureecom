<template>
  <v-textarea v-bind="$attrs" v-model="privateKey" :label="$t('Private Key')" outlined />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPoynt } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PoyntPrivateKey',

  props: {
    value: {
      type: Object as PropType<PaymentPoynt>,
      required: true
    }
  },

  setup(props, { emit }) {
    const privateKey = computed({
      get: () => props.value.private_key,
      set: (private_key) => emit('input', { ...props.value, private_key })
    })

    return {
      privateKey
    }
  }
})
</script>
