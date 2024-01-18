<template>
  <v-text-field
    v-bind="$attrs"
    v-model="outerWidth"
    :label="$t('Outer width')"
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
  name: 'BoxOuterWidth',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const outerWidth = computed({
      get: () => props.value.outer_width,
      set: (outer_width) => emit('input', { ...props.value, outer_width })
    })

    return {
      outerWidth
    }
  }
})
</script>
