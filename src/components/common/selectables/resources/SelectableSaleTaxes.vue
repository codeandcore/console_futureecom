<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-sale-taxes">
    <template v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-sale-taxes-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-sale-taxes-filter-chips"
        @input="reloadCollection"
      />

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-sale-taxes-grid-drawer"
        @input="reloadCollection"
      />

      <v-divider />
    </template>
    <div
      v-if="currentItems.length && showChips"
      class="d-flex flex-gap-16 align-center"
      data-cy="selectable-sale-taxes-chips"
    >
      <span>{{ $t('Selected taxes') }}:</span>
      <deletable-chips v-model="currentItems" :errors="errors" @onDelete="currentItems = $event">
        <template #default="{ item, index }">
          <span :data-cy="`deletable-chips-sale-tax-${index}`">
            {{ item.name }} ({{ movePointerPosition(item.rate, 2) }}%)
          </span>
        </template>
      </deletable-chips>
    </div>

    <template v-if="canRead">
      <v-divider v-if="currentItems.length" />

      <div data-cy="selectable-sale-taxes-grid">
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
            <router-link :to="{ name: 'sale-tax-update', params: { id: item.id } }">
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
import { getChipErrors } from '@/composable/validator/useValidator'
import { gridTemplate } from '@/libs/tables/grid'
import { isEmptyArray } from '@/libs/arrays'
import { saleTaxFilters } from '@/libs/domains/taxes/tax/filters'
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
import type { TaxRate, TaxRatesFilter, TaxRatesGridRequest } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SelectableSaleTaxes',

  components: { FiltersGridDrawer, FiltersChips, DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Object as PropType<{ tax_rate_ids?: string[]; tax_rate_id?: string }>,
      default: undefined
    },
    items: {
      type: Array as PropType<TaxRate[]>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<TaxRatesFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<TaxRatesFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<TaxRatesGridRequest>,
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
    const { canRead } = useCrudChecker('taxes\\taxrate')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<TaxRatesGridRequest>()
    const isFilterOpen = ref(false)

    const currentItems = ref<TaxRate[]>(props.items || [])
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition[] => {
      const searchFilter: FilterTextDefinition<TaxRatesFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<TaxRatesFilter>(saleTaxFilters, props.gridOptions?.filters || [], [searchFilter])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const fetchSelectedIds = () => {
      const ids = (props.value?.tax_rate_ids || []).filter(Boolean)
      if (!props.items && !isEmptyArray(ids)) {
        api.taxes
          .taxRates({ filter: { id: ids }, perPage: -1 })
          .then((val) => (currentItems.value = val.data))
          .catch((err) => console.error(err))
      }
    }

    const reloadCollection = (params: TaxRatesGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true
      api.taxes
        .taxRates(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (items: TaxRate[]) => {
      currentItems.value = items

      if (!props.multiple) {
        const lastSelectedItem = items.at(-1)
        currentItems.value = lastSelectedItem ? [lastSelectedItem] : []
      }

      const ids = currentItems.value.map(({ id }) => id)

      const valueToEmit = props.multiple
        ? { tax_rate_ids: !isEmptyArray(ids) ? ids : [] }
        : { tax_rate_id: ids[0] || null }

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
