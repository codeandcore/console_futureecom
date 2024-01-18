<template>
  <v-select
    v-bind="$attrs"
    v-model="weight_unit"
    outlined
    :items="weightUnits"
    :label="$t('Weight Unit')"
    hide-details="auto"
    clearable
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { WeightUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'ProductDimensionsWeightUnit',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg']

    const weight_unit = computed({
      get: () => props.value?.weight_unit,
      set: (weight_unit) => emit('input', { ...props.value, weight_unit: weight_unit || undefined })
    })

    return {
      weightUnits,
      weight_unit
    }
  }
})
</script>
