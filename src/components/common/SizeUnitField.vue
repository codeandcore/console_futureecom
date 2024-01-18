<template>
  <v-select
    v-bind="$attrs"
    v-model="sizeUnit"
    outlined
    :items="sizeUnits"
    :label="$t('Size Unit')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { SizeUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'SizeUnitField',

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; size_unit: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const sizeUnit = computed({
      get: () => props.value.size_unit,
      set: (size_unit) => emit('input', { ...props.value, size_unit: size_unit || undefined })
    })

    const sizeUnits: SizeUnit[] = ['cm', 'in', 'ft', 'mm', 'm', 'yd']

    return {
      sizeUnit,
      sizeUnits
    }
  }
})
</script>
