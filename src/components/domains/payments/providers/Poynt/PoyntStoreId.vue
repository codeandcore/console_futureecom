<template>
  <v-text-field v-bind="$attrs" v-model="storeId" :label="$t('Store ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPoynt, PaymentPoyntTerminal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PoyntStoreId',

  props: {
    value: {
      type: Object as PropType<PaymentPoynt | PaymentPoyntTerminal>,
      required: true
    }
  },

  setup(props, { emit }) {
    const storeId = computed({
      get: () => props.value.store_id,
      set: (store_id) => emit('input', { ...props.value, store_id })
    })

    return {
      storeId
    }
  }
})
</script>
