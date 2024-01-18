<template>
  <div class="d-flex flex-column flex-gap-16">
    <v-text-field v-model="searchVal" outlined :label="$t('Search zone by name')" append-icon="search" hide-details />

    <deletable-chips v-if="options.showChip" v-model="currentItems" @onDelete="currentItems = $event">
      <template #default="{ item }">
        {{ item.label }}
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
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import DeletableChips from '@/components/common/DeletableChips.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Zone, ZonesGridRequest } from '@futureecom/futureecom-js/dist/services/zone-service'

export interface SelectZoneOptions {
  showChip?: boolean
  grid: ResourceGridOptions
}

export default defineComponent({
  name: 'SelectMultipleZone',

  components: { DeletableChips, ResourceGrid },

  props: {
    value: {
      type: Array as PropType<Zone[]>,
      default: () => []
    },
    options: {
      type: Object as PropType<SelectZoneOptions>,
      default: () => ({ showChip: true })
    }
  },

  setup(props, { emit }) {
    const searchVal = ref('')
    const currentParams = ref<ZonesGridRequest>()

    const currentItems = computed({
      get: () => props.value || [],
      set: (val) => emit('input', val)
    })

    const api = useApi()
    const collection = collectionLoader()

    const reloadCollection = (params: ZonesGridRequest): void => {
      currentParams.value = params
      collection.loadCollection(() => api.zones.zones({ ...currentParams.value }))
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
      currentItems,
      resourceGridOptions,
      items: collection.data,
      reloadCollection
    }
  }
})
</script>
