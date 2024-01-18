<template>
  <div class="d-flex flex-column">
    <slot name="filters">
      <template v-if="options.filters">
        <div class="d-flex justify-space-between">
          <filters-chips :value="value" :definitions="options.filters" @input="onFiltersApplied" />

          <v-btn class="mt-3" depressed small @click="openFilters = !openFilters">
            <span>{{ $t('Filters') }}</span>
            <v-icon right>filter_alt</v-icon>
          </v-btn>
        </div>
        <v-divider class="my-4" />
      </template>
    </slot>

    <slot v-if="options.filters" name="grid.filters">
      <filters-grid-drawer
        :value="value"
        :open.sync="openFilters"
        :definitions="options.filters"
        @input="onFiltersApplied"
      >
        <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
          <slot :name="`grid.filter.${name}`" v-bind="slotData || {}" />
        </template>
      </filters-grid-drawer>
    </slot>

    <v-data-table
      v-bind="$attrs"
      v-model="currentSelectedItems"
      :loading="options.loading"
      :headers="options.headers"
      :items="items"
      item-key="id"
      fixed-header
      :footer-props="{ 'items-per-page-text': $t('Rows per page') }"
      :options="dataTableOptions"
      :server-items-length="options.meta ? options.meta.total : undefined"
      class="v-data-table-shadowless"
      @update:options="onDataTableOptionsUpdate"
    >
      <template #item.created_at="{ item }">
        <span>{{ getFormattedTime(item.created_at) }}</span>
      </template>
      <template #item.updated_at="{ item }">
        <span>{{ getFormattedTime(item.updated_at) }}</span>
      </template>
      <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { transformToApiParams, transformToVuetifyTableOptions } from '@/libs/tables/filters'
import { useTimezone } from '@/composable/useTimezone'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import type { DataOptions } from 'vuetify'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ResourceGrid',

  components: { FiltersGridDrawer, FiltersChips },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<GridRequest>,
      default: undefined
    },
    options: {
      type: Object as PropType<ResourceGridOptions>,
      default: undefined
    },
    items: {
      type: Array,
      default: () => []
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { getFormattedTime } = useTimezone()

    const dataTableOptions = ref<DataOptions>({
      itemsPerPage: 10,
      page: 1,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false
    })

    const currentSelectedItems = computed({
      get: () => props.selectedItems,
      set: (items) => emit('update:selectedItems', items)
    })

    const openFilters = ref(false)

    const onDataTableOptionsUpdate = (dataOptions: DataOptions) => {
      dataTableOptions.value = dataOptions

      const { page, perPage, sort } = transformToApiParams(dataTableOptions.value)

      emit('input', { page, perPage, sort, filter: props.value?.filter })
      emit('onParamsChange', { page, perPage, sort, filter: props.value?.filter })
      emit('onPaginationChange', { page, perPage })
      emit('onSortChange', sort)
    }

    const onFiltersApplied = (params: GridRequest) => {
      const { perPage, sort } = transformToApiParams(dataTableOptions.value)

      emit('input', { ...params, perPage, sort })
      emit('onParamsChange', { ...params, perPage, sort })
      emit('onFiltersApply', params.filter)

      openFilters.value = false
    }

    watch(
      () => props.value,
      () => (dataTableOptions.value = transformToVuetifyTableOptions(props.value || {}, dataTableOptions.value)),
      { deep: true, immediate: true }
    )

    return {
      openFilters,
      dataTableOptions,
      currentSelectedItems,
      onDataTableOptionsUpdate,
      onFiltersApplied,
      getFormattedTime
    }
  }
})
</script>
