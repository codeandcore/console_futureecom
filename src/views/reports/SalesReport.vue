<template>
  <grid-layout v-bind="{ grid, params, options }" :title="$t('Sales report')" @paramsChanged="reloadCollection">
    <template #actions>
      <sales-report-export-button :params="params" />
    </template>

    <template #scrollable.content.top>
      <div class="d-flex flex-column flex-gap-16">
        <sales-report-query-inputs
          v-model="params"
          class="d-flex flex-gap-16 my-4 flex-column"
          @params:changed="reloadCollection"
        />
      </div>
      <v-divider class="my-2" />
    </template>
    <template #item.grouped_by="{ item }">
      <sales-report-grouped-by-labels
        class="text-capitalize my-4"
        :grouped-by="item.grouped_by"
        :groups="paramsGroup"
      />
    </template>
    <template #item.order_number="{ item }">
      <router-link
        :is="orderCanRead || orderCanUpdate || orderCanDelete ? 'router-link' : 'span'"
        :to="{ name: 'single-order', params: { id: item.order_number } }"
      >
        {{ item.order_number }}
      </router-link>
    </template>
    <template #item.meta.total="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.total" :params="params" :value="item.meta.total" />
    </template>
    <template #item.meta.total_gross="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.total_gross" :params="params" :value="item.meta.total_gross" />
    </template>
    <template #item.meta.total_due="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.total_due" :params="params" :value="item.meta.total_due" />
    </template>
    <template #item.meta.total_taxes="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.total_taxes" :params="params" :value="item.meta.total_taxes" />
    </template>
    <template #item.meta.total_discount="{ item }">
      <sales-report-summary
        v-if="item.meta && item.meta.total_discount"
        :params="params"
        :value="item.meta.total_discount"
      />
    </template>
    <template #item.meta.total_refunded="{ item }">
      <sales-report-summary
        v-if="item.meta && item.meta.total_refunded"
        :params="params"
        :value="item.meta.total_refunded"
      />
    </template>
    <template #item.meta.items_count="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.items_count" :params="params" :value="item.meta.items_count" />
    </template>
    <template #item.meta.quantity="{ item }">
      <sales-report-summary v-if="item.meta && item.meta.quantity" :params="params" :value="item.meta.quantity" />
    </template>

    <template #item.total="{ item }">
      <span v-if="item.total">{{ $format.money.withStoreCurrency(item.total) }}</span>
    </template>
    <template #item.total_gross="{ item }">
      <span v-if="item.total_gross">{{ $format.money.withStoreCurrency(item.total_gross) }}</span>
    </template>
    <template #item.total_taxes="{ item }">
      <span v-if="item.total_taxes">{{ $format.money.withStoreCurrency(item.total_taxes) }}</span>
    </template>
    <template #item.total_discount="{ item }">
      <span v-if="item.total_discount">{{ $format.money.withStoreCurrency(item.total_discount) }}</span>
    </template>

    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
    <template #item.actions="{ item }">
      <v-btn depressed color="primary" small :to="redirectTo(item.grouped_by).value">
        {{ $t('View details') }}
        <rtl-chevron-icon />
      </v-btn>
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { ReportViewTypeEnum, SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { SaleRouteNameEnums } from '@/routes/saleRoutes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { getDateRange } from '@/libs/domains/report/formatters'
import { getSalesReportFilters, mapGroupedByToFilters } from '@/libs/domains/report/filters'
import { getSalesReportHeaders } from '@/libs/domains/report/headers'
import { getSalesReportType } from '@/libs/domains/report/reportType'
import { getSalesReportViewType } from '@/libs/domains/report/viewType'
import { gridTemplate } from '@/libs/tables/grid'
import {
  isSalesReportGroupedItemsGridRequest,
  isSalesReportGroupedOrdersGridRequest,
  isSalesReportItemsGridRequest,
  isSalesReportOrdersGridRequest
} from '@/libs/domains/report/guards'
import { parseQueryParams, stringifyQueryParams } from '@/libs/queryParamsSerializer'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import GridLayout from '@/components/layouts/GridLayout.vue'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import SalesReportExportButton from '@/components/domains/reports/SalesReportExportButton.vue'
import SalesReportGroupedByLabels from '@/components/domains/reports/queryInputs/SalesReportGroupedByLabels.vue'
import SalesReportQueryInputs from '@/components/domains/reports/queryInputs/SalesReportQueryInputs.vue'
import SalesReportSummary from '@/components/domains/reports/SalesReportSummaryTotal.vue'
import useApi from '@/composable/useApi'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { Location } from 'vue-router'
import type { SaleReportExtendedGridRequest, SalesReportGridRequestGrouped } from '@/types/reports/SaleReport'
import type { SalesReportGroupedBy } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'SalesReport',

  components: {
    SalesReportExportButton,
    SalesReportGroupedByLabels,
    SalesReportQueryInputs,
    RtlChevronIcon,
    SalesReportSummary,
    GridLayout
  },

  setup() {
    const { t } = useI18n()

    const defaultParams: SaleReportExtendedGridRequest = {
      filter: { created_at: getDateRange('month', -1) },
      group: null,
      totalsOnly: false,
      reportType: SalesReportTypeEnum.ORDERS,
      reportViewType: ReportViewTypeEnum.SUMMARY
    }

    const params = useQueryFromUrl<SaleReportExtendedGridRequest>(defaultParams)

    const reportType = computed((): SalesReportTypeEnum => getSalesReportType(params.value.reportType || ''))
    const reportViewType = computed((): ReportViewTypeEnum => getSalesReportViewType(params.value.reportViewType || ''))

    const paramsGroup = computed((): SalesReportGridRequestGrouped => {
      if (isSalesReportGroupedOrdersGridRequest(params.value, reportType.value)) {
        return params.value.group || []
      }
      if (isSalesReportGroupedItemsGridRequest(params.value, reportType.value)) {
        return params.value.group || []
      }
      return []
    })

    const {
      canRead: orderCanRead,
      canUpdate: orderCanUpdate,
      canDelete: orderCanDelete
    } = useCrudChecker('orders\\order')

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const request = (val: GridRequest) => {
      if (isSalesReportOrdersGridRequest(val, reportType.value)) {
        return api.orders.report(val)
      }

      if (isSalesReportGroupedOrdersGridRequest(val, reportType.value)) {
        return api.orders.reportGrouped(val)
      }

      if (isSalesReportItemsGridRequest(val, reportType.value)) {
        return api.orders.reportItems(val)
      }

      if (isSalesReportGroupedItemsGridRequest(val, reportType.value)) {
        return api.orders.reportItemsGrouped(val)
      }

      return Promise.reject()
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = getSalesReportHeaders(reportType.value, reportViewType.value)
      const filters = getSalesReportFilters(reportType.value)

      const formattedHeaders = headers.map((item) => ({ ...item, text: t(item.text.toString()), sortable: false }))
      const formattedFilters = filters.map((item) => ({ ...item, label: t(item.label) }))

      return {
        headers: formattedHeaders,
        filters: formattedFilters
      }
    })

    const redirectTo = (groupedBy: SalesReportGroupedBy) => {
      return computed((): Location => {
        const reportWith = params.value.with
        const groupFilters = mapGroupedByToFilters(paramsGroup.value, groupedBy)

        const rawQuery = {
          ...params.value,
          filter: { ...params.value.filter },
          groupFilters,
          collectionPage: params.value.page,
          collectionPerPage: params.value.perPage,
          collectionSort: params.value.sort,
          reportType: reportType.value,
          reportViewType: reportViewType.value,
          with: ['data', ...(reportWith || [])]
        }

        const stringified = stringifyQueryParams(rawQuery)

        const name =
          reportType.value === SalesReportTypeEnum.ITEMS
            ? SaleRouteNameEnums.REPORT_DETAILS_ITEMS
            : SaleRouteNameEnums.REPORT_DETAILS

        return { name, query: parseQueryParams(stringified) }
      })
    }

    const reloadCollection = (gridParams?: SaleReportExtendedGridRequest): void => {
      const isViewDetailed = reportViewType.value === ReportViewTypeEnum.DETAILED

      params.value = {
        ...defaultParams,
        ...params.value,
        group: !isViewDetailed ? params.value?.group || null : undefined,
        reportType: params.value.reportType,
        reportViewType: params.value.reportViewType,
        ...gridParams
      }

      const { reportType: type, reportViewType: typeView, totalsOnly, ...rest } = params.value

      request(rest)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .catch(() => console.error('Unknown report type', { type, typeView, rest }))
        .finally(() => (grid.loading = false))
    }

    return {
      params,
      paramsGroup,
      options,
      grid,
      orderCanRead,
      orderCanUpdate,
      orderCanDelete,
      reloadCollection,
      redirectTo
    }
  }
})
</script>
