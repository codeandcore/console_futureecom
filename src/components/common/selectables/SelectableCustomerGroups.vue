<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-customer-groups">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-customer-groups-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-customer-groups-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-customer-groups-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>
    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-customer-groups-chips"
    >
      <span>{{ $t('Selected groups') }}:</span>
      <deletable-chips v-model="currentItems" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-customer-group-${index}`">{{ item.name }}</span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-customer-groups-grid">
        <resource-grid
          v-model="currentParams"
          :options="{ headers: gridOptions && gridOptions.headers, loading: grid.loading, meta: grid.meta }"
          :items="grid.data"
          :multiple="multiple"
          :selected-items="currentItems"
          show-select
          @update:selectedItems="onItemSelect"
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link :to="{ name: 'customer-group-update', params: { id: item.id } }">
              {{ item.name }}
            </router-link>
          </template>
          <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
          </template>
        </resource-grid>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { combineFilters } from '@/libs/tables/filters'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { customerGroupFilter } from '@/libs/domains/customers/group/filters'
import { debouncedWatch } from '@vueuse/core'
import { gridTemplate } from '@/libs/tables/grid'
import { isEmptyArray } from '@/libs/arrays'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type {
  CustomerGroupsGridRequest,
  CustomersGroupFilter,
  CustomersGroups
} from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectableCustomerGroups',

  components: { FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ customer_group?: string[] }>,
      default: undefined
    },
    items: {
      type: Array as PropType<CustomersGroups[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<CustomersGroupFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<CustomersGroupFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<CustomerGroupsGridRequest>,
      default: undefined
    },
    showChips: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { canRead } = useCrudChecker('customer\\group')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<CustomerGroupsGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<CustomersGroups[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition[] => {
      const searchFilter: FilterTextDefinition<CustomersGroupFilter> = {
        code: props.searchKey,
        label: '',
        type: 'text'
      }
      const combined = combineFilters<CustomersGroupFilter>(customerGroupFilter, props.gridOptions?.filters || [], [
        searchFilter
      ])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedCodes = () => {
      const codes = (props.value?.customer_group || []).filter(Boolean)
      if (!props.items && !isEmptyArray(codes)) {
        api.customers
          .groups({ filter: { code: codes }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: CustomerGroupsGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.customers
        .groups(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: CustomersGroups[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const code = currentItems.value.map(({ code }) => code)

      const valueToEmit = props.multiple
        ? { customer_group: !isEmptyArray(code) ? code : [] }
        : { customer_group: code[0] || null }

      emit('input', { ...props.value, ...valueToEmit })
    }

    debouncedWatch(
      searchVal,
      () => {
        const params = {
          ...currentParams.value,
          filter: { ...currentParams.value?.filter, [props.searchKey]: searchVal.value || undefined }
        }

        reloadCollection(params)
      },
      { debounce: 700 }
    )

    if (canRead.value) {
      fetchSelectedCodes()
    }

    return {
      canRead,
      searchVal,
      currentParams,
      currentItems,
      grid,
      filters,
      isFilterOpen,
      onItemSelect,
      reloadCollection
    }
  }
})
</script>
