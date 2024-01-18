<template>
  <v-select
    v-bind="$attrs"
    v-model="size_unit"
    outlined
    :items="sizeUnits"
    :label="$t('Size Unit')"
    hide-details="auto"
    clearable
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { SizeUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'ProductDimensionsSizeUnit',

  props: {
    value: {
      type: [] as PropType<Product['dimensions']>,
      default: null
    }
  },

  setup(props, { emit }) {
    const sizeUnits: SizeUnit[] = ['cm', 'in', 'ft', 'mm', 'm', 'yd']

    const size_unit = computed({
      get: () => props.value?.size_unit,
      set: (size_unit) => emit('input', { ...props.value, size_unit: size_unit || undefined })
    })

    return {
      size_unit,
      sizeUnits
    }
  }
})
</script>
