<template>
  <div class="d-flex flex-column flex-gap-16">
    <v-text-field v-model="searchVal" outlined :label="$t('Search customer name')" append-icon="search" hide-details />

    <deletable-chips
      v-if="options.showChip"
      v-model="currentItems"
      large
      :errors="errors"
      @onDelete="currentItems = $event"
    >
      <template #default="{ item }">
        <div class="d-flex flex-column mx-2">
          <span>{{ item.firstname }} {{ item.lastname }} ({{ item.email }})</span>
        </div>
      </template>
    </deletable-chips>

    <v-divider v-if="currentItems.length" />

    <resource-grid
      v-model="currentParams"
      :options="resourceGridOptions"
      :items="items"
      :selected-items.sync="currentItems"
      show-select
      @onParamsChange="reloadCollection"
    >
      <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </resource-grid>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import { gridTemplate } from '@/libs/tables/grid'
import DeletableChips from '@/components/common/DeletableChips.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type { Customer, CustomerGridRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PropType } from '@vue/composition-api'

export interface SelectCustomerOptions {
  excluded_ids?: string[]
  showChip?: boolean
  grid: ResourceGridOptions
}

export default defineComponent({
  name: 'SelectMultipleCustomers',
  components: { DeletableChips, ResourceGrid },
  props: {
    value: {
      type: Array as PropType<Customer[]>,
      default: () => []
    },
    options: {
      type: Object as PropType<SelectCustomerOptions>,
      default: () => ({ showChip: true })
    },
    errors: {
      type: Object as PropType<{ [key: number]: string }>,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const searchVal = ref('')
    const currentParams = ref<CustomerGridRequest>()

    const currentItems = computed({
      get: () => props.value || [],
      set: (val) => emit('input', val)
    })

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const reloadCollection = (params: CustomerGridRequest): void => {
      currentParams.value = params

      grid.loading = true
      api.customers
        .customers({
          ...currentParams.value,
          filter: { firstname: searchVal.value || undefined }
        })
        .then((value) => {
          grid.data = value.data
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    debouncedWatch(searchVal, () => reloadCollection({ ...currentParams.value }), { debounce: 700 })

    const resourceGridOptions = computed(() => {
      return {
        meta: grid.meta,
        loading: grid.loading,
        ...props.options?.grid
      }
    })

    const items = computed((): Customer[] =>
      grid.data.map((item) => {
        const excludedIds = props.options?.excluded_ids || []
        return {
          ...item,
          isSelectable: excludedIds.length ? !excludedIds.includes(item.id) : true
        }
      })
    )

    return {
      searchVal,
      currentParams,
      currentItems,
      resourceGridOptions,
      items,
      reloadCollection
    }
  }
})
</script>
