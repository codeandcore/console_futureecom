<template>
  <v-select
    v-bind="$attrs"
    v-model="paramsGroup"
    outlined
    dense
    :label="$t('Group by')"
    hide-details="auto"
    multiple
    :items="options"
    clearable
    data-cy="sales-report-group-by"
  />
</template>

<script lang="ts">
import { arrayOrNull } from '@/libs/arrays'
import { computed, defineComponent } from '@vue/composition-api'
import { useDebounceFn } from '@vueuse/core'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportGroupBy',

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      required: true
    },
    options: {
      type: Array as PropType<{ text: string; value: string }[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const paramsGroup = computed({
      get: () => arrayOrNull(props.value.group),
      set: useDebounceFn((group) => emit('input', { ...props.value, group: arrayOrNull(group) }), 700)
    })

    return {
      paramsGroup
    }
  }
})
</script>
