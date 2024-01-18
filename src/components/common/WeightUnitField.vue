<template>
  <v-select
    v-bind="$attrs"
    v-model="weightUnit"
    outlined
    :items="weightUnits"
    :label="$t('Weight Unit')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { WeightUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'WeightUnitField',

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; weight_unit: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const weightUnit = computed({
      get: () => props.value.weight_unit,
      set: (weight_unit) => emit('input', { ...props.value, weight_unit: weight_unit || undefined })
    })

    const weightUnits: WeightUnit[] = ['g', 'kg', 'lb', 'oz']

    return {
      weightUnit,
      weightUnits
    }
  }
})
</script>
