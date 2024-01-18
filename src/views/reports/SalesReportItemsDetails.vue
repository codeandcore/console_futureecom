<template>
  <grid-layout v-bind="{ grid, params: localParams, options }" @paramsChanged="updateCollection">
    <template #title>
      <div v-if="!!data" class="d-flex align-center flex-gap-16">
        <resource-header :header="$t('Sale items report details')" :back-to="backTo" />
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
          <span>{{ $t('Total') }}</span>
          <sales-report-summary :value="data.meta.total" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total gross') }}</span>
          <sales-report-summary :value="data.meta.total_gross" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total discount') }}</span>
          <sales-report-summary :value="data.meta.total_discount" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total taxes') }}</span>
          <sales-report-summary :value="data.meta.total_taxes" />
        </div>
        <div class="d-flex flex-column text-caption font-weight-medium flex-gap-8">
          <span>{{ $t('Total quantity') }}</span>
          <sales-report-summary :value="data.meta.quantity" />
        </div>
      </div>
    </template>
    <template #item.total="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.total) }}</span>
    </template>
    <template #item.total_gross="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.total_gross) }}</span>
    </template>
    <template #item.total_taxes="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.total_taxes) }}</span>
    </template>
    <template #item.total_discount="{ item }">
      <span>{{ $format.money.withStoreCurrency(item.total_discount) }}</span>
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
import { isSalesReportGroupedItemsGridRequest, isSalesReportItemGroupSort } from '@/libs/domains/report/guards'
import { parseQueryParams, stringifyQueryParams } from '@/libs/queryParamsSerializer'
import { rawItemHeaders } from '@/libs/domains/report/headers'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import GridLayout from '@/components/layouts/GridLayout.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import SalesReportFilterLabels from '@/components/domains/reports/queryInputs/SalesReportFilterLabels.vue'
import SalesReportGroupedByLabels from '@/components/domains/reports/queryInputs/SalesReportGroupedByLabels.vue'
import SalesReportSummary from '@/components/domains/reports/SalesReportSummaryTotal.vue'
import useApi from '@/composable/useApi'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { Location } from 'vue-router'
import type { SaleReportExtendedGridRequest, SalesReportItemGroupedData } from '@/types/reports/SaleReport'
import type { SalesReportItemGrouped } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'SalesReportItemsDetails',

  components: {
    SalesReportGroupedByLabels,
    SalesReportFilterLabels,
    ResourceHeader,
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

    const data = ref<SalesReportItemGrouped | undefined>()
    const detailsData = ref<SalesReportItemGroupedData>([])

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = rawItemHeaders.map((item) => ({
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

    if (isSalesReportGroupedItemsGridRequest(rest, SalesReportTypeEnum.ITEMS)) {
      const sort: string[] = [...(rest.sort || [])]

      api.orders
        .reportItemsGrouped({
          ...rest,
          sort: isSalesReportItemGroupSort(sort) ? sort : undefined
        })
        .then((value) => {
          data.value = findReportDetails(value.data, groupFilters)
          detailsData.value = data.value?.data || []
          updateCollection(params.value)
        })
        .finally(() => (grid.loading = false))
    }

    return {
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
