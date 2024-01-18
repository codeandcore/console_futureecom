<template>
  <v-text-field
    v-bind="$attrs"
    v-model="innerWidth"
    :label="$t('Inner width')"
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
  name: 'BoxInnerWidth',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const innerWidth = computed({
      get: () => props.value.inner_width,
      set: (inner_width) => emit('input', { ...props.value, inner_width })
    })

    return {
      innerWidth
    }
  }
})
</script>
