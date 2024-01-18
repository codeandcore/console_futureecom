<template>
  <v-text-field v-bind="$attrs" v-model="iFieldsKey" :label="$t('iFieldsKey')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentCardknox, PaymentCardknoxPOS } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CardknoxIFieldsKey',

  props: {
    value: {
      type: Object as PropType<PaymentCardknox | PaymentCardknoxPOS>,
      required: true
    }
  },

  setup(props, { emit }) {
    const iFieldsKey = computed({
      get: () => props.value.iFieldsKey,
      set: (iFieldsKey) => emit('input', { ...props.value, iFieldsKey })
    })

    return {
      iFieldsKey
    }
  }
})
</script>
