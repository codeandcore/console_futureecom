<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="sortTotal"
    dense
    outlined
    :label="$t('Sort amount')"
    :items="sortTotalItems"
    hide-details="auto"
    data-cy="sales-report-sort-by-totals"
    clearable
  >
    <template #selection="{ item }">
      <span data-cy="sales-report-sort-by-totals-selection" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
    <template #item="{ item }">
      <span data-cy="sales-report-sort-by-totals-item" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { SaleReportSortByParts } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportSortByTotals',

  props: {
    value: {
      type: Object as PropType<SaleReportSortByParts>,
      required: true
    }
  },

  emits: {
    input: (_: SaleReportSortByParts) => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const requiresAmount = computed(() => !['meta.quantity', 'meta.items_count'].includes(props.value.option || ''))

    const sortTotalItems = computed(() => {
      return [
        { text: t('average'), value: 'avg' },
        { text: t('min'), value: 'min' },
        { text: t('max'), value: 'max' },
        { text: t('total'), value: 'sum' }
      ]
    })

    const sortTotal = computed({
      get: () => props.value.total?.replaceAll('.amount', ''),
      set: (total) => emit('input', { ...props.value, total: requiresAmount.value ? `${total}.amount` : total })
    })

    return {
      sortTotalItems,
      sortTotal
    }
  }
})
</script>
