<template>
  <grid-layout v-bind="{ grid, params: localParams, options }" @paramsChanged="updateCollection">
    <template #title>
      <div v-if="!!data" class="d-flex align-center flex-gap-16">
        <resource-header :header="$t('Sales report details')" :back-to="backTo" />
        <v-divider vertical />
        <div class="d-flex flex-gap-16">
          <template v-if="data.grouped_by">
            <div class="d-flex flex-column text-capitalize grey--text text-caption">
              <span>{{ $t('Grouped by') }}:</span>
              <sales-report-grouped-by-labels :grouped-by="data.grouped_by" :groups="params.group || []" />
            </div>
            <v-divider vertical />
          </template>
          <div class="d-flex flex-column text-capitalize grey--text text-caption">
            <span>{{ $t('Filtered by') }}:</span>
            <sales-report-filter-labels :filter="params.filter" />
          </div>
        </div>
      </div>
    </template>

    <template #scrollable.content.top>
      <div v-if="!!data" class="d-flex flex-gap-32 my-8 flex-wrap">
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total due') }}</span>
          <sales-report-summary :value="data.meta.total_due" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total taxes') }}</span>
          <sales-report-summary :value="data.meta.total_taxes" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total discount') }}</span>
          <sales-report-summary :value="data.meta.total_discount" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total refunded') }}</span>
          <sales-report-summary :value="data.meta.total_refunded" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total items count') }}</span>
          <sales-report-summary :value="data.meta.items_count" />
        </div>
      </div>
    </template>
    <template #item.order_number="{ item }">
      <router-link
        :is="canRead || canUpdate || canDelete ? 'router-link' : 'span'"
        :to="{ name: 'single-order', params: { id: item.order_number } }"
      >
        {{ item.order_number }}
      </router-link>
    </template>
    <template #item.customer="{ item }">
      <span>{{ item.customer_firstname }} {{ item.customer_lastname }}</span>
    </template>
    <template #item.status="{ item }">
      <div class="d-flex flex-gap-8">
        <order-status-chip :value="item.status" />
      </div>
    </template>
    <template #item.discounts="{ item }">
      <div v-for="(value, index) of item.discounts || []" :key="`discount-${index}`" class="d-flex flex-gap-8">
        <span>{{ value }}</span>
      </div>
    </template>
    <template #item.taxes="{ item }">
      <div v-for="(value, index) of item.taxes || []" :key="`discount-${index}`" class="d-flex flex-gap-8">
        <span>{{ value.code }}: {{ value.rate }}</span>
      </div>
    </template>
    <template #item.billing_address="{ item }">
      <span>{{ item.billing_country }}{{ `${item.billing_region ? ', ' : ''}${item.billing_region}` }}</span>
    </template>
    <template #item.shipping_address="{ item }">
      <span>{{ item.shipping_country }}{{ `${item.shipping_region ? ', ' : ''}${item.shipping_region}` }}</span>
    </template>
    <template #item.summary.total_due.amount="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { SaleRouteNameEnums } from '@/routes/saleRoutes'
import { SalesReportTypeEnum } from '@/types/reports/SaleReport'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { findReportDetails } from '@/libs/domains/report/utils'
import { gridTemplate, paginateCollection, sortCollection } from '@/libs/tables/grid'
import { isSalesReportGroupSort, isSalesReportGroupedOrdersGridRequest } from '@/libs/domains/report/guards'
import { parseQueryParams, stringifyQueryParams } from '@/libs/queryParamsSerializer'
import { rawHeaders } from '@/libs/domains/report/headers'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import GridLayout from '@/components/layouts/GridLayout.vue'
import GteLteRange from '@/components/tables/filters/GteLteRange.vue'
import OrderStatusChip from '@/components/domains/orders/OrderStatusChip.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import SalesReportExportButton from '@/components/domains/reports/SalesReportExportButton.vue'
import SalesReportFilterLabels from '@/components/domains/reports/queryInputs/SalesReportFilterLabels.vue'
import SalesReportGroupedByLabels from '@/components/domains/reports/queryInputs/SalesReportGroupedByLabels.vue'
import SalesReportSummary from '@/components/domains/reports/SalesReportSummaryTotal.vue'
import useApi from '@/composable/useApi'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { Location } from 'vue-router'
import type { SaleReportExtendedGridRequest, SalesReportGroupedData } from '@/types/reports/SaleReport'
import type { SalesReportGrouped } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'SalesReportDetails',

  components: {
    OrderStatusChip,
    SalesReportExportButton,
    SalesReportFilterLabels,
    SalesReportGroupedByLabels,
    GteLteRange,
    ResourceHeader,
    RtlChevronIcon,
    SalesReportSummary,
    GridLayout
  },

  setup() {
    const { t } = useI18n()

    const params = useQueryFromUrl<SaleReportExtendedGridRequest>({})

    const localParams = computed(() => ({
      page: params.value.collectionPage || 1,
      perPage: params.value.collectionPerPage || 5,
      sort: params.value.collectionSort
    }))

    const data = ref<SalesReportGrouped>()
    const detailsData = ref<SalesReportGroupedData>([])

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const { canRead, canUpdate, canDelete } = useCrudChecker('orders\\order')

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = rawHeaders.map((item) => ({
        ...item,
        text: t(item.text.toString()),
        sortable: false
      }))

      return {
        headers
      }
    })

    const updateCollection = (updatedParams: Pick<SaleReportExtendedGridRequest, 'sort' | 'page' | 'perPage'>) => {
      const { page, perPage, sort } = updatedParams || {}

      params.value = { ...params.value, collectionPage: page, collectionPerPage: perPage, collectionSort: sort }

      const sorted = sort?.[0] ? sortCollection(detailsData.value, sort[0]) : detailsData.value
      const paginated = paginateCollection(detailsData.value.length, Number(page || 1), Number(perPage || 5))

      grid.data = sorted.slice(paginated.from_item_index, paginated.to_item_index)
      grid.meta = {
        ...grid.meta,
        ...paginated
      }
    }

    const {
      reportViewType,
      reportType,
      collectionPage,
      collectionPerPage,
      collectionSort,
      totalsOnly,
      groupFilters,
      ...rest
    } = params.value

    const query = stringifyQueryParams({
      ...rest,
      reportViewType,
      reportType,
      totalsOnly,
      sort: collectionSort,
      page: collectionPage,
      perPage: collectionPerPage,
      with: (rest.with || []).includes('deleted') ? ['deleted'] : undefined
    })

    const backTo: Location = { name: SaleRouteNameEnums.REPORTS, query: parseQueryParams(query) }

    if (isSalesReportGroupedOrdersGridRequest(rest, SalesReportTypeEnum.ORDERS)) {
      const sort: string[] = [...(rest.sort || [])]

      api.orders
        .reportGrouped({
          ...rest,
          sort: isSalesReportGroupSort(sort) ? sort : undefined
        })
        .then((value) => {
          data.value = findReportDetails(value.data, groupFilters)
          detailsData.value = data.value?.data || []
          updateCollection(params.value)
        })
        .finally(() => (grid.loading = false))
    }

    return {
      canRead,
      canUpdate,
      canDelete,
      params,
      localParams,
      options,
      grid,
      data,
      backTo,
      updateCollection
    }
  }
})
</script>
