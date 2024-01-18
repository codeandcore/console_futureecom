<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="length"
    :label="$t('Length')"
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
  name: 'ProductDimensionsLength',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const length = computed({
      get: () => props.value?.length,
      set: (length: null | undefined | string | number) => {
        emit('input', { ...props.value, length: length !== '' ? length : undefined })
      }
    })

    return {
      length
    }
  }
})
</script>
