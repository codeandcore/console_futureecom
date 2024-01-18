<template>
  <v-text-field
    v-bind="$attrs"
    v-model="outerDepth"
    :label="$t('Outer depth')"
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
  name: 'BoxOuterDepth',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const outerDepth = computed({
      get: () => props.value.outer_depth,
      set: (outer_depth) => emit('input', { ...props.value, outer_depth })
    })

    return {
      outerDepth
    }
  }
})
</script>
