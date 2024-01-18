<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Brands') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-brand" depressed color="primary" :to="{ name: 'brand-create' }">
        {{ $t('Add new brand') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'brand-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'brand-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <brand-action-delete icon :value="item" @success="onDeleteSuccess" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { brandFilters } from '@/libs/domains/catalog/brands/filters'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import BrandActionDelete from '@/components/domains/catalog/brands/actions/BrandActionDelete.vue'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { BrandGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Brands',

  components: {
    ButtonAction,
    BrandActionDelete,
    GridLayout
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const params = useQueryFromUrl<BrandGridRequest>({ sort: ['-created_at'] })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\brand')

    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

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

    const reloadCollection = (gridParams?: BrandGridRequest): void => {
      params.value = { ...params.value, ...gridParams }

      api.catalog
        .brands(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Sort Order'), value: 'order' },
        { text: t('Name'), value: 'name' },
        { text: t('Slug'), value: 'slug' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = brandFilters.map((filter) => ({
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
      onRequestError
    }
  }
})
</script>
