<template>
  <div>
    <v-text-field v-model="searchVal" outlined :label="$t('Search customer name')" append-icon="search" hide-details />
    <resource-grid
      v-model="currentParams"
      :options="resourceGridOptions"
      :items="items"
      @onParamsChange="reloadCollection"
    >
      <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" :selected="currentItem" />
      </template>
    </resource-grid>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { Customer, CustomerGridRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export interface SelectCustomerOptions {
  showChip?: boolean
  grid: ResourceGridOptions
}

export default defineComponent({
  name: 'SearchCustomer',
  components: { ResourceGrid },
  props: {
    value: {
      type: Object as PropType<Customer>,
      default: () => undefined
    },
    options: {
      type: Object as PropType<SelectCustomerOptions>,
      default: () => ({ showChip: true })
    }
  },

  setup(props, { emit }) {
    const searchVal = ref('')
    const currentParams = ref<CustomerGridRequest>()

    const currentItem = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const api = useApi()
    const collection = collectionLoader()

    const reloadCollection = (params: CustomerGridRequest): void => {
      currentParams.value = params
      collection.loadCollection(() => {
        return api.customers.customers({
          ...currentParams.value,
          filter: { firstname: searchVal.value || undefined },
          sort: ['-created_at']
        })
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
      searchVal,
      currentParams,
      currentItem,
      resourceGridOptions,
      items: collection.data,
      reloadCollection
    }
  }
})
</script>
