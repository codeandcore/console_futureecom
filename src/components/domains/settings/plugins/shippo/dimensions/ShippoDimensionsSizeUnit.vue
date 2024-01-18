<template>
  <v-select
    v-bind="$attrs"
    v-model="dimensionSizeUnit"
    outlined
    :items="sizeUnits"
    :label="$t('Size Unit')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'
import type { SizeUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'ShippoDimensionsSizeUnit',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['dimensions']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const sizeUnits: SizeUnit[] = ['cm', 'in', 'ft', 'mm', 'm', 'yd']

    const dimensionSizeUnit = computed({
      get: () => props.value.size_unit,
      set: (size_unit) => emit('input', { ...props.value, size_unit })
    })

    return {
      dimensionSizeUnit,
      sizeUnits
    }
  }
})
</script>
