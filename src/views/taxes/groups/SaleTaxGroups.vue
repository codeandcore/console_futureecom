<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Sale tax groups') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn
        v-if="canCreate && canReadZones && canReadTaxRates"
        data-cy="add-new-sale-tax-group"
        depressed
        color="primary"
        :to="{ name: 'sale-tax-group-create' }"
      >
        {{ $t('Add new sale tax group') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'sale-tax-group-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.shipping_taxable="{ item }">
      <v-icon>{{ item.shipping_taxable ? 'check' : 'close' }}</v-icon>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'sale-tax-group-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <sale-tax-group-action-delete icon :value="item" @success="onDeleteSuccess" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { saleTaxGroupFilters } from '@/libs/domains/taxes/group/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import SaleTaxGroupActionDelete from '@/components/domains/taxes/SaleTaxGroup/actions/SaleTaxGroupActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { TaxRateGroupFilter, TaxRateGroupGridRequest } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'TaxGroups',
  components: {
    GridLayout,
    ButtonAction,
    SaleTaxGroupActionDelete
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const params = useQueryFromUrl<TaxRateGroupGridRequest>({ sort: ['-created_at'] })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('taxes\\taxgroup')
    const { canRead: canReadZones } = useCrudChecker('zones\\zone')
    const { canRead: canReadTaxRates } = useCrudChecker('taxes\\taxrate')

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        reloadCollection()
      } else {
        addErrorToast(data.message)
      }
    }

    const reloadCollection = (gridParams?: TaxRateGroupGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.taxes
        .taxRateGroups(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Zone Code'), value: 'zone_code' },
        { text: t('Shipping Taxable'), value: 'shipping_taxable', align: 'center' },
        { text: t('Taxonomy'), value: 'taxonomy' },
        { text: t('Customer group'), value: 'customer_group' },
        { text: t('Updated At'), value: 'updated_at' },
        { text: t('Created At'), value: 'created_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition<TaxRateGroupFilter>[] = saleTaxGroupFilters.map((filter) => ({
        ...filter,
        label: t(filter.label)
      }))

      return {
        headers,
        filters
      }
    })

    return {
      canCreate,
      canReadZones,
      canReadTaxRates,
      params,
      options,
      grid,
      onDeleteSuccess,
      reloadCollection,
      onRequestError
    }
  }
})
</script>
