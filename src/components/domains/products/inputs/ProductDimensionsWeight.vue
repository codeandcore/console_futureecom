<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="weight"
    :label="$t('Weight')"
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
  name: 'ProductDimensionsWeight',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const weight = computed({
      get: () => props.value?.weight,
      set: (weight: null | undefined | string | number) => {
        emit('input', { ...props.value, weight: weight !== '' ? weight : undefined })
      }
    })

    return {
      weight
    }
  }
})
</script>
