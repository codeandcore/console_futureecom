<template>
  <div>
    <slot name="search">
      <div class="d-flex">
        <v-text-field
          v-model="search"
          dense
          outlined
          append-icon="mdi-magnify"
          :label="searchLabel"
          single-line
          hide-details
          clearable
          :disabled="!$can(readAbility)"
        />
        <no-permissions-tooltip v-if="!$can(readAbility) && !loadingItems" class="mx-3" />
      </div>
    </slot>
    <slot v-if="showChips" name="chip-selected" :selected="selected">
      <div class="d-flex justify-space-between my-4">
        <deletable-chips v-model="selected" @onDelete="onDelete">
          <template #default="{ item }">
            {{ item[chipText] }}
          </template>
        </deletable-chips>
        <slot name="after-chips" />
      </div>
    </slot>
    <slot name="table-top" />
    <v-data-table
      v-if="$can(readAbility)"
      v-model="selected"
      :search="search"
      :headers="headers"
      :items="data"
      :loading="loadingItems"
      :item-key="itemValue"
      :show-select="showSelect"
      :server-items-length="metadata.total"
      @update:options="reloadCollection"
    >
      <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import DeletableChips from '@/components/common/DeletableChips.vue'
import FutureEcom from '@futureecom/futureecom-js'
import NoPermissionsTooltip from '@/components/common/NoPermissionsTooltip.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { DataTableGrid } from '@/types/DataTableGrid'
import type { PropType } from '@vue/composition-api'
import type { ResponseCollection } from '@futureecom/futureecom-js'
import type { TranslateResult } from 'vue-i18n'
import type { abilities } from '@/types/Abilities'

type allowedResources = 'taxonomies' | 'products' | 'customers' | 'customerGroups' | 'permissions' | 'roles'

/** @deprecated, use SelectMultiple<Resource>.vue component instead **/
export default defineComponent({
  name: 'DataTableResource',
  components: { NoPermissionsTooltip, DeletableChips },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    searchLabel: {
      type: [] as PropType<string | TranslateResult>,
      default: 'Search by name'
    },
    searchCriteria: {
      type: String,
      default: 'name'
    },
    headers: {
      type: Array,
      default: () => []
    },
    readAbility: {
      type: String as PropType<abilities>,
      required: true
    },
    showChips: {
      type: Boolean,
      default: true
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    chipText: {
      type: String,
      default: undefined
    },
    itemValue: {
      type: String,
      default: undefined
    },
    api: {
      type: Object as PropType<FutureEcom>,
      default: undefined
    },
    resource: {
      type: String as PropType<allowedResources>,
      required: true
    },
    filters: {
      type: Object,
      default: () => {}
    },
    disabledValues: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const api = props.api || useApi()

    const resources: { [p: string]: (params?: any) => Promise<ResponseCollection<any>> } = {
      taxonomies: (params?) => api.catalog.taxonomies(params),
      products: (params?) => api.catalog.products(params),
      customers: (params?) => api.customers.customers(params),
      customerGroups: (params?) => api.customers.groups(params),
      users: (params?) => api.auth.users(params),
      permissions: (params?) => api.auth.permissions(params),
      roles: (params?) => api.auth.roles(params)
    }

    const search = ref('')
    const collection = collectionLoader()
    const lastParams = ref()
    const selected = ref<any[]>(props.value || [])

    if (props.value?.length && props.itemValue) {
      resources[props.resource]({ perPage: -1, filter: { [props.itemValue]: props.value } }).then((data) => {
        selected.value = data.data as []
      })
    }

    debouncedWatch(search, () => reloadCollection(lastParams.value), { debounce: 700 })

    const reloadCollection = (params?: DataTableGrid): void => {
      const filter = search.value ? { [props.searchCriteria || 'name']: search.value } : undefined
      lastParams.value = { ...params, filter: { ...filter, ...props.filters } }
      const resourceParams = { filter: lastParams.value.filter, perPage: params?.itemsPerPage, page: params?.page }
      collection.loadCollection(() => resources[props.resource](resourceParams))
    }

    const items = computed(() => {
      return collection.data.value.map((item: any) => ({
        ...item,
        isSelectable: !props.disabledValues?.includes(item[props.itemValue])
      }))
    })

    const onDelete = (items: []): void => {
      selected.value = items
    }

    watch(selected, () => {
      const val = selected.value.map((item) => (props.itemValue ? item[props.itemValue] : item))
      emit('input', val)
    })

    return {
      search,
      selected,
      reloadCollection,
      metadata: collection.metadata,
      data: items,
      loadingItems: collection.loading,
      onDelete
    }
  }
})
</script>
