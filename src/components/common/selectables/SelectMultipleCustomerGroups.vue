<template>
  <div class="d-flex flex-column flex-gap-16">
    <v-text-field
      v-model="searchVal"
      outlined
      :label="$t('Search customer group name')"
      append-icon="search"
      hide-details
    />

    <deletable-chips v-if="options.showChip" v-model="currentItems" @onDelete="currentItems = $event">
      <template #default="{ item }">
        {{ item.name }}
      </template>
    </deletable-chips>

    <v-divider />

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
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import DeletableChips from '@/components/common/DeletableChips.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type {
  CustomerGroupsGridRequest,
  CustomersGroups
} from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export interface SelectCustomerGroupOptions {
  showChip?: boolean
  grid: ResourceGridOptions
}

/** @deprecated use SelectableCustomerGroups.vue instead **/
export default defineComponent({
  name: 'SelectMultipleCustomerGroup',
  components: { DeletableChips, ResourceGrid },
  props: {
    value: {
      type: Array as PropType<CustomersGroups[]>,
      default: () => []
    },
    options: {
      type: Object as PropType<SelectCustomerGroupOptions>,
      default: () => ({ showChip: true })
    }
  },

  setup(props, { emit }) {
    const searchVal = ref('')
    const currentParams = ref<CustomerGroupsGridRequest>()

    const currentItems = computed({
      get: () => props.value || [],
      set: (val) => emit('input', val)
    })

    const api = useApi()
    const collection = collectionLoader()

    const reloadCollection = (params: CustomerGroupsGridRequest): void => {
      currentParams.value = params
      collection.loadCollection(() => {
        return api.customers.groups({ ...currentParams.value, filter: { name: searchVal.value || undefined } })
      })
    }

    debouncedWatch(searchVal, () => reloadCollection({ ...currentParams.value }), { debounce: 700 })

    const resourceGridOptions = computed(() => {
      return {
        meta: collection.metadata.value,
        loading: collection.loading.value,
        ...props.options?.grid
      }
    })

    return {
      currentParams,
      currentItems,
      resourceGridOptions,
      items: collection.data,
      reloadCollection,
      searchVal
    }
  }
})
</script>
