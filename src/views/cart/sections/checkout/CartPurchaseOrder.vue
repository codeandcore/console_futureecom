<template>
  <v-text-field v-model="purchase_order" outlined :label="$t('Purchase order')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { OrderableCheckout } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartPurchaseOrder',

  props: {
    checkout: {
      type: Object as PropType<OrderableCheckout>,
      required: true
    }
  },

  emits: ['update:checkout'],

  setup(props, { emit }) {
    const purchase_order = computed({
      get: () => props.checkout.purchase_order,
      set: (purchase_order) => emit('update:checkout', { ...props.checkout, purchase_order })
    })

    return {
      purchase_order
    }
  }
})
</script>
