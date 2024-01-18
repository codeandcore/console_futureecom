<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-shipping-methods">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-shipping-methods-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-shipping-methods-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-shipping-methods-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>
    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-shipping-methods-chips"
    >
      <span>{{ $t('Selected shippings') }}:</span>
      <deletable-chips v-model="currentItems" :errors="errors" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-shipping-method-${index}`">{{ item.name }}</span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-shipping-methods-grid">
        <resource-grid
          v-model="currentParams"
          :options="{ headers: gridOptions && gridOptions.headers, loading: grid.loading, meta: grid.meta }"
          :items="grid.data"
          show-select
          :single-select="!multiple"
          :selected-items="currentItems"
          @update:selectedItems="onItemSelect"
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link :to="{ name: 'shipping-method-update', params: { id: item.id } }">
              {{ item.name }}
            </router-link>
          </template>
          <template #item.rate="{ item }">
            <span>{{ movePointerPosition(item.rate, 2) }}%</span>
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
import { debouncedWatch } from '@vueuse/core'
import { gridTemplate } from '@/libs/tables/grid'
import { isEmptyArray } from '@/libs/arrays'
import { shippingMethodFilters } from '@/libs/domains/carts/shipping/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import movePointerPosition from '@/libs/movePointerPosition'
import useApi from '@/composable/useApi'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PropType } from '@vue/composition-api'
import type {
  Shipping,
  ShippingFilter,
  ShippingGridRequest
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SelectableShippingMethods',

  components: { FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ shipping_ids?: string[]; shipping_id?: string }>,
      default: undefined
    },
    items: {
      type: Array as PropType<Shipping[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<ShippingFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<ShippingFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<ShippingGridRequest>,
      default: undefined
    },
    showChips: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const { canRead } = useCrudChecker('cart\\shipping')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<ShippingGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<Shipping[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition[] => {
      const searchFilter: FilterTextDefinition<ShippingFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<ShippingFilter>(shippingMethodFilters, props.gridOptions?.filters || [], [
        searchFilter
      ])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedIds = () => {
      const ids = (props.value?.shipping_ids || []).filter(Boolean)

      if (!props.items && !isEmptyArray(ids)) {
        api.carts
          .shippings({ filter: { id: ids }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: ShippingGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.carts
        .shippings(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: Shipping[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const ids = currentItems.value.map(({ id }) => id)

      const valueToEmit = props.multiple
        ? { shipping_ids: !isEmptyArray(ids) ? ids : [] }
        : { shipping_id: ids[0] || null }

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
      fetchSelectedIds()
    }

    return {
      canRead,
      searchVal,
      currentParams,
      currentItems,
      grid,
      filters,
      isFilterOpen,
      movePointerPosition,
      onItemSelect,
      reloadCollection
    }
  }
})
</script>
