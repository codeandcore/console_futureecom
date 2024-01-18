<template>
  <div>
    <span
      v-for="(value, key) of filter"
      :key="`group-by-${key}`"
      class="d-flex text-caption grey--text flex-gap-4 align-center"
    >
      <span>{{ key.charAt(0).toUpperCase() + formatCodeToHumanText(key).slice(1) }}:</span>
      <gte-lte-range v-if="value.gte || value.lte" class="d-flex align-center" :value="value" :type="formatType(key)" />
      <span v-else>{{ `${value}`.replaceAll(',', ', ') }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { filters, itemsFilters } from '@/libs/domains/report/filters'
import { formatCodeToHumanText } from '@/libs/domains/report/formatters'
import GteLteRange from '@/components/tables/filters/GteLteRange.vue'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportFilterLabels',
  components: { GteLteRange },

  props: {
    filter: {
      type: Object as PropType<SaleReportExtendedGridRequest['filter']>,
      required: true
    }
  },

  setup() {
    const moneyFilters = [...filters, ...itemsFilters]
      .filter((item) => item.type === 'money-range')
      .map((item) => `${item.code}`)

    const formatType = (filterName: string) => (moneyFilters.includes(filterName) ? 'money-range' : 'range')

    return {
      formatType,
      formatCodeToHumanText
    }
  }
})
</script>
