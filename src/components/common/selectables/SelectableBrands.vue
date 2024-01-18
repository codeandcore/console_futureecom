<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-brands">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-brands-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-brands-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-brands-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>

    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-brands-chips"
    >
      <span>{{ $t('Selected') }}:</span>
      <deletable-chips v-model="currentItems" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-brand-${index}`">{{ item.name }}</span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-brands-grid">
        <resource-grid
          v-model="currentParams"
          :options="{ headers: gridOptions ? gridOptions.headers : [], loading: grid.loading, meta: grid.meta }"
          :items="grid.data"
          :multiple="multiple"
          :selected-items="currentItems"
          show-select
          @update:selectedItems="onItemSelect"
          @onParamsChange="reloadCollection"
        >
          <template #item.slug="{ item }">
            <router-link :to="{ name: 'brand-update', params: { id: item.id } }">
              {{ item.slug }}
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
import { brandFilters } from '@/libs/domains/catalog/brands/filters'
import { combineFilters } from '@/libs/tables/filters'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
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
import type { Brand, BrandFilter, BrandGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid } from '@/types/Grids'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'SelectableBrands',

  components: { FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ brand_ids?: string[]; brand_id?: string }>,
      default: undefined
    },
    items: {
      type: Array as PropType<Brand[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<BrandFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<BrandFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<BrandGridRequest>,
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
    const { canRead } = useCrudChecker('catalog\\brand')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<BrandGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<Brand[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition[] => {
      const searchFilter: FilterTextDefinition<BrandFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<BrandFilter>(brandFilters, props.gridOptions?.filters || [], [searchFilter])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedIds = () => {
      const ids = (props.value?.brand_ids || [props.value?.brand_id || '']).filter(Boolean)
      if (!props.items && !isEmptyArray(ids)) {
        api.catalog
          .brands({ filter: { id: ids }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: BrandGridRequest): void => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.catalog
        .brands(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: Brand[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const ids = currentItems.value.map((brand) => brand.id)
      const valueToEmit = props.multiple ? { brand_ids: !isEmptyArray(ids) ? ids : [] } : { brand_id: ids[0] || null }
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
      onItemSelect,
      reloadCollection
    }
  }
})
</script>
