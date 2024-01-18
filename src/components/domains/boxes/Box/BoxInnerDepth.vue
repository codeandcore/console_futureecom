<template>
  <v-text-field
    v-bind="$attrs"
    v-model="innerDepth"
    :label="$t('Inner depth')"
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
  name: 'BoxInnerDepth',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const innerDepth = computed({
      get: () => props.value.inner_depth,
      set: (inner_depth) => emit('input', { ...props.value, inner_depth })
    })

    return {
      innerDepth
    }
  }
})
</script>
