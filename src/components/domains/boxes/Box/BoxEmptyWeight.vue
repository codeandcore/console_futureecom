<template>
  <v-text-field
    v-bind="$attrs"
    v-model="emptyWeight"
    :label="$t('Empty weight')"
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
  name: 'BoxEmptyWeight',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const emptyWeight = computed({
      get: () => props.value.empty_weight,
      set: (empty_weight) => emit('input', { ...props.value, empty_weight })
    })

    return {
      emptyWeight
    }
  }
})
</script>
