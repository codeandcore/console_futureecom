<template>
  <v-text-field v-model="quantity" :label="$t('Quantity')" outlined type="number" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductQuantity',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const quantity = computed({
      get: () => (props.value.inventory ? props.value.inventory.quantity : 1),
      set: (quantity) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, quantity }
        })
    })

    return {
      quantity
    }
  }
})
</script>
