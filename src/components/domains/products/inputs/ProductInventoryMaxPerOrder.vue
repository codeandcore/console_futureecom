<template>
  <v-text-field v-model.number="max_per_order" :label="$t('Max per order')" outlined type="number" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryMaxPerOrder',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const max_per_order = computed({
      get: () => (props.value.inventory ? props.value.inventory.max_per_order : undefined),
      set: (val) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, max_per_order: typeof val === 'number' ? val : null }
        })
    })

    return {
      max_per_order
    }
  }
})
</script>
