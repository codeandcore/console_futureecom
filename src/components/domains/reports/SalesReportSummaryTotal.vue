<template>
  <span v-if="totalsOnly && value">{{ getFormattedValue(value.sum).value }}</span>
  <div v-else-if="value" class="d-flex flex-gap-8 text-caption">
    <div class="d-flex flex-column">
      <span>{{ $t('Min') }}</span>
      <span>{{ getFormattedValue(value.min).value }}</span>
    </div>
    <v-divider vertical />
    <div class="d-flex flex-column">
      <span>{{ $t('Max') }}</span>
      <span>{{ getFormattedValue(value.max).value }}</span>
    </div>
    <v-divider vertical />
    <div class="d-flex flex-column">
      <span>{{ $t('Avg') }}</span>
      <span>{{ getFormattedValue(value.avg).value }}</span>
    </div>
    <v-divider vertical />
    <div class="d-flex flex-column">
      <span>{{ $t('Total') }}</span>
      <span>{{ getFormattedValue(value.sum).value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { isTruthy } from '@/libs/boolean'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'
import type { SalesReportGroupedMetaFields } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'SalesReportSummary',

  props: {
    value: {
      type: Object as PropType<SalesReportGroupedMetaFields<Money | number>>,
      default: undefined
    },
    params: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  setup(props) {
    const getFormattedValue = (val: Money | number) => {
      return computed((ctx) => (typeof val === 'number' ? val : ctx.$format.money.withStoreCurrency(val)))
    }

    const totalsOnly = computed(() => isTruthy(props.params?.totalsOnly))

    return {
      totalsOnly,
      getFormattedValue
    }
  }
})
</script>
