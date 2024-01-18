<template>
  <v-checkbox
    v-model="paramsWith"
    v-bind="$attrs"
    :label="`${$t('Include deleted')} ${$t(value.reportType || 'orders')}`"
    hide-details="auto"
    data-cy="sales-report-with"
    @change="paramsWith = !paramsWith"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportWith',

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      required: true
    }
  },

  setup(props, { emit }) {
    const paramsWith = computed({
      get: (): boolean => Boolean((props.value.with || []).length),
      set: (val) => emit('input', { ...props.value, with: val ? ['deleted'] : undefined })
    })

    return {
      paramsWith
    }
  }
})
</script>
