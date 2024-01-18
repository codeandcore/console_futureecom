<template>
  <v-text-field v-bind="$attrs" v-model="supplier" :label="$t('Supplier')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentTranzila } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TranzilaSupplier',

  props: {
    value: {
      type: Object as PropType<PaymentTranzila>,
      required: true
    }
  },

  setup(props, { emit }) {
    const supplier = computed({
      get: () => props.value.supplier,
      set: (supplier) => emit('input', { ...props.value, supplier })
    })

    return {
      supplier
    }
  }
})
</script>
