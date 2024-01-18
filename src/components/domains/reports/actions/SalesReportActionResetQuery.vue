<template>
  <div class="d-flex">
    <v-btn depressed small class="mt-1" @click="reset">
      <span class="d-flex flex-gap-8 align-center">
        {{ $t('Reset all') }}
        <v-icon>refresh</v-icon>
      </span>
    </v-btn>
  </div>
</template>
<script lang="ts">
import { ReportViewTypeEnum } from '@/types/reports/SaleReport'
import { defineComponent } from '@vue/composition-api'
import { getDateRange } from '@/libs/domains/report/formatters'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportActionResetQuery',

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const reset = () => {
      emit('input', {
        ...props.value,
        sort: undefined,
        with: undefined,
        group: props.value.reportViewType === ReportViewTypeEnum.SUMMARY ? null : undefined,
        filter: { created_at: getDateRange('month', -1) }
      })
    }

    return {
      reset
    }
  }
})
</script>
