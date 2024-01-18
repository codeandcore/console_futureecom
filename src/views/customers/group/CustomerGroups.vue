<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Customer Groups') }}</span>
          <v-btn
            v-if="$canAny('create,customers\\group', 'manage,customers\\group')"
            data-cy="add-new-customer-group"
            depressed
            color="primary"
            :to="{ name: 'customer-group-create' }"
          >
            {{ $t('Add new group') }}
          </v-btn>
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
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link
              :is="canAccessCustomerGroup ? 'router-link' : 'span'"
              :to="{ name: 'customer-group-update', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
          </template>
          <template #item.status="{ item }">
            <pre>{{ item.status }}</pre>
          </template>
          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'customer-group-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <customer-group-action-delete :value="item" icon @onSuccess="onDeleteSuccess" />
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
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { customerGroupFilter } from '@/libs/domains/customers/group/filters'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CustomerGroupActionDelete from '@/components/domains/customers/group/actions/CustomerGroupActionDelete.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { CustomerGroupsGridRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CustomerGroups',
  components: {
    ButtonAction,
    CustomerGroupActionDelete,
    TablePagination,
    Scrollable,
    ResourceGrid,
    ScrollableResource
  },
  setup(props, { root }) {
    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()
    const params = computed<CustomerGroupsGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })
    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }
    const reloadCollection = (gridParams?: CustomerGroupsGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true
      api.customers
        .groups(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }
    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Code'), value: 'code' }
      ]
      if (canAccessCustomerGroup.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }
      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition[] = customerGroupFilter.map((filter) => ({
        ...filter,
        label: ctx.$t(filter.label)
      }))

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })
    const canAccessCustomerGroup = computed((ctx) => {
      return ctx.$canAny('manage,customers\\group', 'delete,customers\\group', 'update,customers\\group').value
    })
    const canDelete = computed((ctx) => ctx.$canAny('manage,customers\\group', 'delete,customers\\group').value)
    return {
      params,
      onDeleteSuccess,
      reloadCollection,
      options,
      grid,
      canAccessCustomerGroup
    }
  }
})
</script>
