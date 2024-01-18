<template>
  <div class="d-flex flex-gap-8 align-center">
    <label>{{ $t('Report type') }}:</label>

    <v-btn-toggle
      v-model="reportType"
      mandatory
      color="primary"
      data-cy="sale-report-query-type-buttons"
      v-bind="$attrs"
    >
      <v-btn value="orders" depressed small data-cy="reports-query-type-button">
        {{ $t('Orders') }}
      </v-btn>
      <v-btn value="items" depressed small data-cy="reports-query-type-button">
        {{ $t('Items') }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportType',

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const reportType = computed({
      get: () => props.value?.reportType,
      set: (reportType) => emit('input', { ...props.value, reportType })
    })

    return {
      reportType
    }
  }
})
</script>
