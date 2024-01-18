<template>
  <div class="d-flex flex-gap-8 align-center">
    <label>{{ $t('Report view') }}:</label>

    <v-btn-toggle
      :value="reportViewType"
      color="primary"
      data-cy="sale-report-query-view-type-buttons"
      v-bind="$attrs"
      mandatory
      @change="reportViewType = $event"
    >
      <v-btn depressed small value="summary" data-cy="reports-query-view-type-button">
        {{ $t('Summary') }}
      </v-btn>
      <v-btn depressed small value="detailed" data-cy="reports-query-view-type-button">
        {{ $t('Detailed') }}
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
    const reportViewType = computed({
      get: () => props.value?.reportViewType,
      set: (reportViewType) => emit('input', { ...props.value, reportViewType })
    })

    return {
      reportViewType
    }
  }
})
</script>
