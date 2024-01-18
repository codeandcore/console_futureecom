<template>
  <v-text-field
    v-bind="$attrs"
    v-model="innerLength"
    :label="$t('Inner length')"
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
  name: 'BoxInnerLength',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const innerLength = computed({
      get: () => props.value.inner_length,
      set: (inner_length) => emit('input', { ...props.value, inner_length })
    })

    return {
      innerLength
    }
  }
})
</script>
