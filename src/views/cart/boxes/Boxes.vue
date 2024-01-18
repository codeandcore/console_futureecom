<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Boxes') }}</span>
          <v-btn
            v-if="$canAny('manage,cart\\box', 'create,cart\\box')"
            data-cy="add-new-category"
            depressed
            color="primary"
            :to="{ name: 'box-create' }"
          >
            {{ $t('Add new box') }}
          </v-btn>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <resource-grid
          v-model="params"
          selectable-key="id"
          :options="options"
          :items="grid.data"
          hide-default-footer
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link
              :is="canAccessBox ? 'router-link' : 'span'"
              :to="{ name: 'box-update', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
          </template>
          <template #item.dimensions="{ item }">
            <div class="d-flex flex-column flex-gap-8 my-4">
              <div class="d-flex justify-space-between flex-wrap flex-gap-8">
                <span>{{ $t('Inner') }}:</span>
                <span class="d-flex flex-gap-8">
                  <span>{{ item.inner_length }} x {{ item.inner_width }} x {{ item.inner_depth }}</span>
                  <span class="grey--text">{{ item.size_unit }}</span>
                </span>
              </div>
              <v-divider />
              <div class="d-flex justify-space-between flex-wrap flex-gap-8">
                <span>{{ $t('Outer') }}:</span>
                <span class="d-flex flex-gap-8">
                  <span>{{ item.outer_length }} x {{ item.outer_width }} x {{ item.outer_depth }}</span>
                  <span class="grey--text">{{ item.size_unit }}</span>
                </span>
              </div>
            </div>
          </template>
          <template #item.empty_weight="{ item }">
            <span class="d-flex flex-gap-8">
              <span>{{ item.empty_weight }}</span>
              <span class="grey--text">{{ item.weight_unit }}</span>
            </span>
          </template>
          <template #item.max_weight="{ item }">
            <span class="d-flex flex-gap-8">
              <span>{{ item.max_weight }}</span>
              <span class="grey--text">{{ item.weight_unit }}</span>
            </span>
          </template>
          <template #item.active="{ item }">
            <v-icon v-if="item.active">check</v-icon>
            <v-icon v-else>close</v-icon>
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
              :to="{ name: 'box-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <box-action-delete icon :value="item" @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import BoxActionDelete from '@/components/domains/boxes/Box/actions/BoxActionDelete.vue'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { BoxGridRequest } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid } from '@/types/Grids'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Boxes',

  components: {
    BoxActionDelete,
    ButtonAction,
    TablePagination,
    Scrollable,
    ScrollableResource,
    ResourceGrid
  },

  setup() {
    const params = useQueryFromUrl<BoxGridRequest>({ sort: ['-created_at'] })

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: BoxGridRequest): void => {
      params.value = { ...params.value, ...gridParams }

      api.carts
        .boxes(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Active'), value: 'active' },
        { text: ctx.$t('Size Unit'), value: 'size_unit', sortable: false },
        { text: ctx.$t('Dimensions'), value: 'dimensions', sortable: false },
        { text: ctx.$t('Weight Unit'), value: 'weight_unit', sortable: false },
        { text: ctx.$t('Empty Weight'), value: 'empty_weight', sortable: false },
        { text: ctx.$t('Max Weight'), value: 'max_weight' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      if (canAccessBox.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'boolean', code: 'active', label: ctx.$t('Active') },
        { type: 'text', code: 'name', label: ctx.$t('Name') },
        {
          type: 'select-multiple',
          code: 'size_unit',
          label: ctx.$t('Size unit'),
          options: [
            { text: 'cm', value: 'cm' },
            { text: 'in', value: 'in' },
            { text: 'ft', value: 'ft' },
            { text: 'mm', value: 'mm' },
            { text: 'm', value: 'm' },
            { text: 'yd', value: 'yd' }
          ]
        },
        { type: 'range', code: 'outer_length', label: ctx.$t('Outer length') },
        { type: 'range', code: 'outer_width', label: ctx.$t('Outer width') },
        { type: 'range', code: 'outer_depth', label: ctx.$t('Outer depth') },
        { type: 'range', code: 'inner_length', label: ctx.$t('Inner length') },
        { type: 'range', code: 'inner_width', label: ctx.$t('Inner width') },
        { type: 'range', code: 'inner_depth', label: ctx.$t('Inner depth') },
        {
          type: 'select-multiple',
          code: 'weight_unit',
          label: ctx.$t('Weight unit'),
          options: [
            { text: 'g', value: 'g' },
            { text: 'kg', value: 'kg' },
            { text: 'lb', value: 'lb' },
            { text: 'oz', value: 'oz' }
          ]
        },
        { type: 'range', code: 'empty_weight', label: ctx.$t('Empty weight') },
        { type: 'range', code: 'max_weight', label: ctx.$t('Max weight') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created At') },
        { type: 'date', code: 'updated_at', label: ctx.$t('Updated At') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const canAccessBox = computed((ctx) => {
      return ctx.$canAny('manage,cart\\box', 'delete,cart\\box', 'update,cart\\box').value
    })

    const canDelete = computed((ctx) => ctx.$canAny('delete,cart\\box', 'manage,cart\\box').value)

    return {
      params,
      reloadCollection,
      onDeleteSuccess,
      options,
      grid,
      canAccessBox
    }
  }
})
</script>
