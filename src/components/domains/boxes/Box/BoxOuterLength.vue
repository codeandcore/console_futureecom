<template>
  <v-text-field
    v-bind="$attrs"
    v-model="outerLength"
    :label="$t('Outer length')"
    :suffix="value.size_unit"
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
  name: 'BoxOuterLength',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const outerLength = computed({
      get: () => props.value.outer_length,
      set: (outer_length) => emit('input', { ...props.value, outer_length })
    })

    return {
      outerLength
    }
  }
})
</script>
