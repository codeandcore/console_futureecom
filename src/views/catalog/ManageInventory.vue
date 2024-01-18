<template>
  <scrollable>
    <template #sticky>
      <v-card flat class="mb-0">
        <v-card-title class="d-flex">
          <span class="text-h6">{{ $t('Manage Inventory') }}</span>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <resource-grid
          v-model="params"
          :options="options"
          :items="grid.data"
          hide-default-footer
          :expanded="expanded"
          @onParamsChange="reloadCollection"
        >
          <template #item="val">
            <manage-inventory-row :key="val.item.id" :value="val.item" @onTableRowToggle="toggleExpand(val.item)" />
          </template>
          <template #expanded-item="val">
            <td v-if="hasChildren(val.item)" :colspan="val.headers.length">
              <v-data-table
                :headers="options.headers"
                :items="val.item.children"
                item-key="id"
                hide-default-footer
                hide-default-header
              >
                <template #header="{ props }">
                  <thead style="visibility: collapse">
                    <tr>
                      <th v-for="header in props.headers" :key="header.value" :width="header.width" height="0px" />
                    </tr>
                  </thead>
                </template>
                <template #item="nested">
                  <manage-inventory-row
                    :key="nested.item.id"
                    :value="nested.item"
                    class="grey"
                    :class="$vuetify.theme.dark ? 'darken-3' : 'lighten-3'"
                  />
                  <v-divider />
                </template>
              </v-data-table>
            </td>
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate } from '@/libs/tables/grid'
import { hasChildren } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import ManageInventoryRow from '@/components/domains/inventory/ManageInventoryRow.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { Product, ProductGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'ManageInventory',

  components: { TablePagination, Scrollable, ManageInventoryRow, ResourceGrid },

  setup(props, { root }) {
    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())
    const expanded = ref<Product[]>([])

    const params = computed<ProductGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const reloadCollection = (gridParams?: ProductGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      api.catalog
        .products({
          include: ['children'],
          ...params.value
        })
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const toggleExpand = (item: Product): void => {
      const found = expanded.value.find((val) => val.id === item.id)
      if (!found) {
        expanded.value = [item, ...expanded.value]
        return
      }
      expanded.value = expanded.value.filter((val) => val.id !== item.id)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('SKU'), value: 'sku', width: '20%' },
        { text: ctx.$t('Sort order'), value: 'order', width: '10%' },
        { text: ctx.$t('Name'), value: 'name', width: '20%' },
        { text: ctx.$t('Current Qty'), value: 'inventory.quantity', width: '10%' },
        { text: ctx.$t('New Qty'), value: 'new', width: '40%' }
      ]

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'order', label: ctx.$t('Order') },
        { type: 'text', code: 'name', label: ctx.$t('Name') },
        { type: 'text', code: 'sku', label: ctx.$t('SKU') },
        { type: 'range', code: 'inventory.quantity', label: ctx.$t('Quantity') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    return {
      options,
      hasChildren,
      expanded,
      toggleExpand,
      params,
      reloadCollection,
      grid
    }
  }
})
</script>
