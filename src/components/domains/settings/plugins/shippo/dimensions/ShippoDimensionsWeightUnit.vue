<template>
  <v-select
    v-bind="$attrs"
    v-model="dimensionWeightUnit"
    outlined
    :items="weightUnits"
    :label="$t('Size Unit')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'
import type { WeightUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'ShippoDimensionsWeightUnit',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['dimensions']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const weightUnits: WeightUnit[] = ['g', 'kg', 'lb', 'oz']

    const dimensionWeightUnit = computed({
      get: () => props.value.weight_unit,
      set: (weight_unit) => emit('input', { ...props.value, weight_unit })
    })

    return {
      dimensionWeightUnit,
      weightUnits
    }
  }
})
</script>
