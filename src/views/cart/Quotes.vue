<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Quotes') }}</span>
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
          <template #item.id="{ item }">
            <router-link
              :is="canAccessQuote(item).value ? 'router-link' : 'span'"
              :to="{ name: 'quote-update', params: { id: item.id } }"
            >
              {{ getShortId(item.id) }}
            </router-link>
          </template>
          <template #item.customer.firstname="{ item }">
            <router-link
              :is="canAccessCustomer && item.customer.customer_id ? 'router-link' : 'span'"
              :to="{
                name: 'customer-update',
                params: { id: item.customer.customer_id }
              }"
            >
              {{ item.customer.firstname }}
            </router-link>
          </template>
          <template #item.customer.lastname="{ item }">
            <router-link
              :is="canAccessCustomer && item.customer.customer_id ? 'router-link' : 'span'"
              :to="{
                name: 'customer-update',
                params: { id: item.customer.customer_id }
              }"
            >
              {{ item.customer.lastname }}
            </router-link>
          </template>
          <template #item.status="{ item }">
            <quote-status-chip :value="item.status" />
          </template>
          <template #item.summary.total_due.amount="{ item }">
            <span v-if="item.summary.total_due">{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.updated_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
          </template>
          <template #item.edit="{ item }">
            <button-action
              v-if="canAccessQuote(item).value"
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'quote-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <quote-action-delete :value="item" :disabled="grid.loading" icon @onSuccess="onDeleteSuccess" />
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
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CartActionDelete from '@/components/domains/carts/actions/CartActionDelete.vue'
import QuoteActionDelete from '@/components/domains/carts/quotes/actions/QuoteActionDelete.vue'
import QuoteStatusChip from '@/components/domains/carts/quotes/QuoteStatusChip.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import getShortId from '@/libs/getShortId'
import useApi from '@/composable/useApi'
import type { Cart, CartGridRequest } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Quotes',

  components: {
    QuoteStatusChip,
    QuoteActionDelete,
    ButtonAction,
    TablePagination,
    Scrollable,
    CartActionDelete,
    ResourceGrid,
    ScrollableResource
  },

  setup(props, { root }) {
    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

    const params = computed<CartGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: CartGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.carts
        .quotes(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('ID'), value: 'id' },
        { text: ctx.$t('Status'), value: 'status' },
        { text: ctx.$t('First Name'), value: 'customer.firstname' },
        { text: ctx.$t('Last Name'), value: 'customer.lastname' },
        { text: ctx.$t('Total'), value: 'summary.total_due.amount' },
        { text: ctx.$t('Item Count'), value: 'summary.total_items_count' },
        { text: ctx.$t('Created By'), value: 'created_by.name' },
        { text: ctx.$t('Created From'), value: 'created_by.from' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' },
        { text: '', value: 'edit', sortable: false, align: 'center', width: '0px' }
      ]

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'coupon', label: ctx.$t('Coupon') },
        { type: 'text', code: 'customer.firstname', label: ctx.$t('Customer first name') },
        { type: 'text', code: 'customer.lastname', label: ctx.$t('Customer last name') },
        {
          type: 'select-multiple',
          code: 'status',
          label: ctx.$t('Status'),
          options: [
            { text: ctx.$t('pending'), value: 'pending' },
            { text: ctx.$t('processing'), value: 'processing' },
            { text: ctx.$t('available'), value: 'available' },
            { text: ctx.$t('rejected'), value: 'rejected' },
            { text: ctx.$t('adjusting'), value: 'adjusting' },
            { text: ctx.$t('approved'), value: 'approved' },
            { text: ctx.$t('closed'), value: 'closed' },
            { text: ctx.$t('errored'), value: 'errored' }
          ]
        },
        { type: 'text', code: 'created_by.name', label: ctx.$t('Created by') },
        {
          type: 'select-multiple',
          code: 'created_by.from',
          label: ctx.$t('Created From'),
          options: [
            { text: ctx.$t('Storefront'), value: 'storefront' },
            { text: ctx.$t('Point of Sale'), value: 'pos' },
            { text: ctx.$t('Console'), value: 'console' },
            { text: ctx.$t('API'), value: 'api' }
          ]
        },
        { type: 'money-range', code: 'summary.total_due.amount', label: ctx.$t('Total due') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created At') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const customerExists = (item: Cart) => {
      return Boolean(item.customer.firstname && item.customer.lastname && item.customer.email)
    }

    const canAccessQuote = (item: Cart) =>
      computed((ctx) => {
        if (!customerExists(item)) {
          return false
        }
        return ctx.$can('read,cart\\quote', 'create,cart\\quote') || ctx.$can('manage,cart\\quote').value
      })

    const canAccessCustomer = computed((ctx) => {
      return ctx.$canAny('manage,customers\\customer', 'delete,customers\\customer', 'update,customers\\customer').value
    })

    const canDelete = computed((ctx) => ctx.$canAny('manage,cart\\quote', 'delete,cart\\quote').value)

    return {
      params,
      options,
      grid,
      canAccessCustomer,
      reloadCollection,
      getShortId,
      onDeleteSuccess,
      canAccessQuote
    }
  }
})
</script>
