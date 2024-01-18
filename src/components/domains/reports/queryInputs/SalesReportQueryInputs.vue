<template>
  <div data-cy="sales-report-query-input">
    <div class="d-flex flex-gap-16 flex-wrap">
      <sales-report-query-meta-inputs v-model="params" class="d-flex flex-gap-16" />
      <v-divider vertical />
      <sales-report-show-only-totals v-if="params.reportViewType === ReportViewTypeEnum.SUMMARY" v-model="params" />
    </div>

    <v-divider />

    <div class="d-flex flex-gap-16 align-start flex-wrap">
      <sales-report-date-filters
        v-model="params"
        class="d-flex flex-gap-8 align-center flex-wrap"
        data-cy="sales-report-query-input-date-filters"
      />
      <v-slide-y-reverse-transition mode="out-in">
        <div v-if="isSummaryViewType" class="d-flex flex-gap-16 justify-center">
          <sales-report-group-by v-model="params" :options="optionsGroupBy" />
          <sales-report-with v-model="params" class="mt-1" />
        </div>
      </v-slide-y-reverse-transition>
    </div>
    <div class="d-flex flex-wrap flex-gap-32">
      <sales-report-sort-by-inputs
        :key="`${params.sort}`"
        v-model="params"
        :items="optionsSortBy"
        class="d-flex flex-gap-16 align-start flex-wrap"
      />
      <sales-report-action-reset-query v-model="params" />
    </div>
  </div>
</template>

<script lang="ts">
import { ReportViewTypeEnum, SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { computed, defineComponent } from '@vue/composition-api'
import { formatCodeToHumanText } from '@/libs/domains/report/formatters'
import { getSalesReportGroups } from '@/libs/domains/report/groups'
import { getSalesReportSorts } from '@/libs/domains/report/sorts'
import { getSalesReportType } from '@/libs/domains/report/reportType'
import { useI18n } from 'vue-i18n-bridge'
import SalesReportActionResetQuery from '@/components/domains/reports/actions/SalesReportActionResetQuery.vue'
import SalesReportDateFilters from '@/components/domains/reports/queryInputs/SalesReportDateFilters.vue'
import SalesReportGroupBy from '@/components/domains/reports/queryInputs/SalesReportGroupBy.vue'
import SalesReportQueryMetaInputs from '@/components/domains/reports/queryInputs/SalesReportQueryMetaInputs.vue'
import SalesReportShowOnlyTotals from '@/components/domains/reports/queryInputs/SalesReportShowOnlyTotals.vue'
import SalesReportSortByInputs from '@/components/domains/reports/queryInputs/SalesReportSortByInputs.vue'
import SalesReportWith from '@/components/domains/reports/queryInputs/SalesReportWith.vue'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportQueryInputs',

  components: {
    SalesReportQueryMetaInputs,
    SalesReportShowOnlyTotals,
    SalesReportActionResetQuery,
    SalesReportWith,
    SalesReportDateFilters,
    SalesReportGroupBy,
    SalesReportSortByInputs
  },

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  emits: {
    'params:changed': (_?: SaleReportExtendedGridRequest) => true,
    'input': (_?: SaleReportExtendedGridRequest) => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const params = computed({
      get: () => props.value,
      set: (val: SaleReportExtendedGridRequest) => {
        emit('input', val)

        if (`${val.sort}` === `${props.value?.sort}`) {
          emit('params:changed', val)
        }
      }
    })

    const type = computed((): SalesReportTypeEnum => getSalesReportType(params.value?.reportType || ''))

    const isSummaryViewType = computed(() => params.value?.reportViewType === ReportViewTypeEnum.SUMMARY)

    const optionsSortBy = computed(() => {
      const hasGroup = Boolean((params.value?.group || []).length || params.value?.group === null)
      return getSalesReportSorts(type.value, hasGroup)
    })

    const optionsGroupBy = computed(() => {
      const arr = getSalesReportGroups(type.value)
      return arr.map((value) => ({ text: t(formatCodeToHumanText(value)), value }))
    })

    return {
      params,
      isSummaryViewType,
      optionsSortBy,
      optionsGroupBy,
      ReportViewTypeEnum
    }
  }
})
</script>
