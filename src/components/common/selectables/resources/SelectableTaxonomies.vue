<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-taxonomies">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-taxonomies-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-taxonomies-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-taxonomies-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>
    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-taxonomies-chips"
    >
      <span>{{ $t('Selected taxonomy') }}:</span>
      <deletable-chips v-model="currentItems" :errors="errors" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-taxonomy-${index}`">{{ item.name }}</span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-taxonomies-grid">
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
            <router-link :to="{ name: 'taxonomy-update', params: { id: item.id } }">
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
import { taxonomyFilters } from '@/libs/domains/catalog/taxonomy/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PropType } from '@vue/composition-api'
import type {
  Taxonomy,
  TaxonomyFilter,
  TaxonomyGridRequest
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SelectableTaxonomies',

  components: { FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ taxonomy_ids?: string[]; taxonomy_id?: string }>,
      default: undefined
    },
    items: {
      type: Array as PropType<Taxonomy[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<TaxonomyFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<TaxonomyFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<TaxonomyGridRequest>,
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
    const { canRead } = useCrudChecker('catalog\\taxonomy')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<TaxonomyGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<Taxonomy[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition[] => {
      const searchFilter: FilterTextDefinition<TaxonomyFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<TaxonomyFilter>(taxonomyFilters, props.gridOptions?.filters || [], [searchFilter])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedIds = () => {
      const ids = (props.value?.taxonomy_ids || [props.value?.taxonomy_id || '']).filter(Boolean)
      if (!props.items && !isEmptyArray(ids)) {
        api.catalog
          .taxonomies({ filter: { id: ids }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: TaxonomyGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.catalog
        .taxonomies(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: Taxonomy[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const ids = currentItems.value.map(({ id }) => id)

      const valueToEmit = props.multiple
        ? { taxonomy_ids: !isEmptyArray(ids) ? ids : [] }
        : { taxonomy_id: ids[0] || null }
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
