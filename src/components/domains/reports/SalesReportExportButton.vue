<template>
  <v-btn v-bind="$attrs" color="primary" :loading="isLoading" depressed @click="exportReportData">
    {{ $t('Export data') }}
  </v-btn>
</template>

<script lang="ts">
import { createLink } from '@/libs/createLink'
import { defineComponent, ref } from '@vue/composition-api'
import {
  isSalesReportGroupedItemsGridRequest,
  isSalesReportGroupedOrdersGridRequest
} from '@/libs/domains/report/guards'
import { stringifyRange } from '@/libs/domains/report/formatters'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportExportButton',
  props: {
    params: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const isLoading = ref(false)

    const api = useApi()

    const getFileName = () => {
      const range = stringifyRange(props.params.filter?.created_at)
      return range ? `${props.params.reportType}_${range}.csv` : `${props.params.reportType}.csv`
    }

    const exportReportData = () => {
      const { reportType, reportViewType, collectionPage, collectionPerPage, collectionSort, groupFilters, ...rest } =
        props.params

      const fn = (): Promise<Blob> => {
        if (isSalesReportGroupedItemsGridRequest(rest, reportType || '')) {
          return api.orders.exportReportItems({ ...rest, filter: { ...rest.filter, ...groupFilters } })
        }
        if (isSalesReportGroupedOrdersGridRequest(rest, reportType || '')) {
          return api.orders.exportReport({ ...rest, filter: { ...rest.filter, ...groupFilters } })
        }
        return Promise.reject()
      }

      isLoading.value = true

      fn()
        .then((blob) => createLink([blob], getFileName()).click())
        .catch((error) => addErrorToast(error?.response.data.message || t('Unable to export report data')))
        .finally(() => (isLoading.value = false))
    }

    return {
      isLoading,
      exportReportData
    }
  }
})
</script>
