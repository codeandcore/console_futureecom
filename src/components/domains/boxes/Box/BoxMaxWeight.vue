<template>
  <v-text-field
    v-bind="$attrs"
    v-model="maxWeight"
    :label="$t('Max weight')"
    :suffix="value.weight_unit"
    outlined
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Box } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BoxMaxWeight',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const maxWeight = computed({
      get: () => props.value.max_weight,
      set: (max_weight) => emit('input', { ...props.value, max_weight })
    })

    return {
      maxWeight
    }
  }
})
</script>
