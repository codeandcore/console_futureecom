<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="width"
    :label="$t('Width')"
    outlined
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDimensionsWidth',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const width = computed({
      get: () => props.value?.width,
      set: (width: null | undefined | string | number) => {
        emit('input', { ...props.value, width: width !== '' ? width : undefined })
      }
    })

    return {
      width
    }
  }
})
</script>
