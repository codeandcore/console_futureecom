<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="quantity"
    v-mask="$format.mask.quantityMask"
    class="mt-4"
    :label="$t('Quantity')"
    outlined
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import type { ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductTierQuantity',

  props: {
    value: {
      type: Object as PropType<ProductTier>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const quantity = ref(props.value?.quantity || 1)
    watch(quantity, (quantity) => emit('input', { ...props.value, quantity }))

    return {
      quantity
    }
  }
})
</script>
