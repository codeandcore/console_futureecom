<template>
  <div>
    <sales-report-type v-model="params" />
    <v-divider vertical />
    <sales-report-view-type v-model="params" />
  </div>
</template>
<script lang="ts">
import { ReportViewTypeEnum, SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { computed, defineComponent, ref } from '@vue/composition-api'
import SalesReportType from '@/components/domains/reports/queryInputs/SalesReportType.vue'
import SalesReportViewType from '@/components/domains/reports/queryInputs/SalesReportViewType.vue'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest, SalesReportPersistentParams } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportQueryMetaInputs',

  components: {
    SalesReportViewType,
    SalesReportType
  },

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const savedParams = ref<SalesReportPersistentParams>({})

    const params = computed({
      get: () => props.value,
      set: (val: SaleReportExtendedGridRequest) => {
        const { reportType, reportViewType } = val

        const previousReportType: SalesReportTypeEnum = props.value.reportType || SalesReportTypeEnum.ORDERS
        const previousReportViewType: ReportViewTypeEnum = props.value.reportViewType || ReportViewTypeEnum.SUMMARY

        const previousKey = `${previousReportType}-${previousReportViewType}`
        const newKey = `${val?.reportType || ''}-${val?.reportViewType || ''}`

        savedParams.value = { ...savedParams.value, [previousKey]: structuredClone(params.value) }

        const currentParams = structuredClone(savedParams.value[newKey])

        const toEmit: SaleReportExtendedGridRequest = {
          ...props.value,
          sort: undefined,
          with: undefined,
          totalsOnly: false,
          filter: props.value.filter?.created_at ? { created_at: props.value.filter?.created_at } : undefined,
          ...currentParams,
          group: reportViewType === ReportViewTypeEnum.SUMMARY ? currentParams?.group || null : undefined,
          reportType,
          reportViewType
        }

        emit('input', structuredClone(toEmit))
      }
    })

    return {
      params
    }
  }
})
</script>
