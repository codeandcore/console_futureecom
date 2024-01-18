<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-products">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-products-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-products-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-products-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>

    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-products-chips"
    >
      <span>{{ $t('Selected products') }}:</span>
      <deletable-chips v-model="currentItems" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-product-${index}`">{{ item.name }}</span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-products-grid">
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
          <template #item.image_url="{ item }">
            <image-zoom>
              <template #thumbnail>
                <product-image-preview :value="item.image_url" height="40" width="40" class="my-3 rounded-lg" />
              </template>
              <template #zoom>
                <product-image-preview :value="item.image_url" max-width="300" />
              </template>
            </image-zoom>
          </template>
          <template #item.sku="{ item }">
            <router-link :to="{ name: 'product-update', params: { id: item.id } }">
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
import { debouncedWatch } from '@vueuse/core'
import { gridTemplate } from '@/libs/tables/grid'
import { isEmptyArray } from '@/libs/arrays'
import { productFilters } from '@/libs/domains/catalog/products/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import ImageZoom from '@/components/common/ImageZoom.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type {
  Product,
  ProductFilter,
  ProductGridRequest
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectableProducts',

  components: { ProductImagePreview, ImageZoom, FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ product_ids?: string[]; product_id?: string }>,
      default: undefined
    },
    items: {
      type: Array as PropType<Product[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<ProductFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<ProductFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<ProductGridRequest>,
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
    const { canRead } = useCrudChecker('catalog\\product')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<ProductGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<Product[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition<ProductFilter>[] => {
      const searchFilter: FilterTextDefinition<ProductFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<ProductFilter>(productFilters, props.gridOptions?.filters || [], [searchFilter])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedIds = () => {
      const ids = (props.value?.product_ids || [props.value?.product_id || '']).filter(Boolean)
      if (!props.items && !isEmptyArray(ids)) {
        api.catalog
          .products({ filter: { id: ids }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: ProductGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.catalog
        .products(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: Product[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const ids = currentItems.value.map(({ id }) => id)

      const valueToEmit = props.multiple
        ? { product_ids: !isEmptyArray(ids) ? ids : [] }
        : { product_id: ids[0] || null }
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
