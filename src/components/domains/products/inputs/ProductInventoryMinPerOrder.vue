<template>
  <v-text-field v-model.number="min_per_order" :label="$t('Min per order')" outlined type="number" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryMinPerOrder',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const min_per_order = computed({
      get: () => (props.value.inventory ? props.value.inventory.min_per_order : undefined),
      set: (val) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, min_per_order: typeof val === 'number' ? val : null }
        })
    })

    return {
      min_per_order
    }
  }
})
</script>
