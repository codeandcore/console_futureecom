<template>
  <v-text-field
    v-model.number="order"
    v-bind="$attrs"
    data-cy="sort-order-input"
    :label="$attrs.label || $t('Sort Order')"
    hide-details="auto"
    outlined
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

interface SortOrderInput {
  [key: string]: unknown

  order?: null | number | string
}

export default defineComponent({
  name: 'SortOrder',

  props: {
    value: {
      type: Object as PropType<SortOrderInput>,
      required: true
    }
  },

  setup(props, { emit }) {
    const order = computed({
      get: () => props.value.order,
      set: (order: SortOrderInput['order']) => emit('input', { ...props.value, order: order || 0 })
    })

    return {
      order
    }
  }
})
</script>
