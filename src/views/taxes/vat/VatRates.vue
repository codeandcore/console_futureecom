<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Vat rates') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn
        v-if="canCreate"
        data-cy="add-new-sale-tax-group"
        depressed
        color="primary"
        :to="{ name: 'vat-rate-create' }"
      >
        {{ $t('Add new vat tax') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'vat-rate-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.value="{ item }">
      <span>{{ movePointerPosition(item.value, 2) }}%</span>
    </template>
    <template #item.product_ids="{ item }">
      <span>{{ (item.product_ids || []).length }}</span>
    </template>
    <template #item.shipping_ids="{ item }">
      <span>{{ (item.shipping_ids || []).length }}</span>
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
        :to="{ name: 'vat-rate-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <vat-rate-action-delete icon :value="item" @success="onDeleteSuccess" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import { vatFilters } from '@/libs/domains/taxes/vat/filters'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import VatRateActionDelete from '@/components/domains/taxes/vat/actions/VatRateActionDelete.vue'
import movePointerPosition from '@/libs/movePointerPosition'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { VatRatesFilter, VatRatesGridRequest } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRates',

  components: { GridLayout, ButtonAction, VatRateActionDelete },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const params = useQueryFromUrl<VatRatesGridRequest>({ sort: ['-created_at'] })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('taxes\\vat')

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

    const reloadCollection = (gridParams?: VatRatesGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.taxes
        .vatRates(params.value)
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
        { text: t('Value'), value: 'value' },
        { text: t('Products Count'), value: 'product_ids', sortable: false },
        { text: t('Shippings Count'), value: 'shipping_ids', sortable: false },
        { text: t('Updated At'), value: 'updated_at' },
        { text: t('Created At'), value: 'created_at' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      if (canUpdate.value && canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition<VatRatesFilter>[] = vatFilters.map((filter) => ({
        ...filter,
        label: t(filter.label)
      }))

      return {
        headers,
        filters
      }
    })

    return {
      params,
      options,
      grid,
      canCreate,
      onDeleteSuccess,
      reloadCollection,
      movePointerPosition,
      onRequestError
    }
  }
})
</script>
