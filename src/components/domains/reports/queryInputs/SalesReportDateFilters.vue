<template>
  <div data-cy="reports-query-date-filters">
    <v-btn-toggle v-model="createdAt" color="primary" data-cy="reports-query-date-filters-buttons">
      <v-btn depressed small :value="getDateRange('month', -1)" data-cy="reports-query-date-filters-last-month">
        {{ $t('Last month') }}
      </v-btn>
      <v-btn depressed small :value="getDateRange('month')" data-cy="reports-query-date-filters-this-month">
        {{ $t('This month') }}
      </v-btn>
      <v-btn depressed small :value="getDateRange('year', -1)" data-cy="reports-query-date-filters-last-year">
        {{ $t('Last year') }}
      </v-btn>
      <v-btn depressed small :value="getDateRange('year')" data-cy="reports-query-date-filters-this-year">
        {{ $t('This year') }}
      </v-btn>
    </v-btn-toggle>
    <date-range v-model="createdAt" :label="$t('Date range')" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getDateRange } from '@/libs/domains/report/formatters'
import DateRange from '@/components/tables/filters/FilterDateRange.vue'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportDateFilters',

  components: { DateRange },

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      required: true
    }
  },

  setup(props, { emit }) {
    const createdAt = computed({
      get: () => props.value.filter?.created_at || {},
      set: (created_at) => {
        const filter = { ...props.value?.filter, created_at: created_at || undefined }
        emit('input', { ...props.value, filter })
      }
    })

    return {
      createdAt,
      getDateRange
    }
  }
})
</script>
