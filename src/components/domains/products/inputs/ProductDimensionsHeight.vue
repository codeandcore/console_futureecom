<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="height"
    :label="$t('Height')"
    hide-details="auto"
    outlined
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDimensionsHeight',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const height = computed({
      get: () => props.value?.height,
      set: (height: null | undefined | string | number) => {
        emit('input', { ...props.value, height: height !== '' ? height : undefined })
      }
    })

    return {
      height
    }
  }
})
</script>
