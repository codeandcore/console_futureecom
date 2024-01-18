<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="sortOption"
    dense
    outlined
    :label="$t('Sort option')"
    :items="sortOptionItems"
    hide-details="auto"
    data-cy="sales-report-sort-by-option"
    clearable
  >
    <template #selection="{ item }">
      <span data-cy="sales-report-sort-by-option-selection" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
    <template #item="{ item }">
      <span data-cy="sales-report-sort-by-option-item" class="text-capitalize">{{ $t(item.text) }}</span>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { formatCodeToHumanText, splitReportSort } from '@/libs/domains/report/formatters'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { SaleReportSortByParts } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportSortByOption',

  props: {
    value: {
      type: Object as PropType<SaleReportSortByParts>,
      required: true
    },
    items: {
      type: Array as PropType<string[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const sortOptionItems = computed(() => {
      return props.items.map((item) => {
        const option = item.replace('-', '')

        const summarySeparator = splitReportSort(option)

        if (summarySeparator.separator) {
          const prefix = summarySeparator.split[0]
          const withRemovedKeyword = prefix.replace('meta.', '')
          return { text: t(formatCodeToHumanText(withRemovedKeyword)), value: prefix }
        }

        const withRemovedKeyword = option.replace('.amount', '')
        return { text: t(formatCodeToHumanText(withRemovedKeyword)), value: option }
      })
    })

    const sortOption = computed({
      get: () => props.value.option?.replaceAll('-', '') || '',
      set: (option: string) => emit('input', { ...props.value, option, total: undefined })
    })

    return {
      sortOptionItems,
      sortOption
    }
  }
})
</script>
