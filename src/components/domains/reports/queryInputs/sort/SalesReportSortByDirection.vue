<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="sortDirection"
    dense
    outlined
    :label="$t('Sort direction')"
    :items="sortDirectionItems"
    hide-details="auto"
    data-cy="sales-report-sort-by-direction"
  >
    <template #selection="{ item }">
      <span data-cy="sales-report-sort-by-direction-selection" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
    <template #item="{ item }">
      <span data-cy="sales-report-sort-by-direction-item" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { SaleReportSortByParts } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportSortByDirection',

  props: {
    value: {
      type: Object as PropType<SaleReportSortByParts>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const sortDirectionItems = computed(() => [
      { text: `${t('ascending')} ↑`, value: '' },
      { text: `${t('descending')} ↓`, value: '-' }
    ])

    const sortDirection = computed({
      get: () => props.value.direction,
      set: (direction) => emit('input', { ...props.value, direction })
    })

    return {
      sortDirectionItems,
      sortDirection
    }
  }
})
</script>
