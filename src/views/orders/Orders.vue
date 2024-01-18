<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Orders') }}</span>
          <v-btn v-if="canCreateCart" data-cy="add-new-cart" depressed color="primary" :to="{ name: 'cart-create' }">
            {{ $t('Create cart') }}
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
          <template #item.number="{ item }">
            <router-link :to="{ name: 'single-order', params: { id: item.number } }">
              {{ item.number }}
            </router-link>
          </template>
          <template #item.customer.firstname="{ item }">
            <router-link
              :is="canAccessCustomer && item.customer.customer_id ? 'router-link' : 'span'"
              :to="{ name: 'customer-update', params: { id: item.customer.customer_id } }"
            >
              {{ item.customer.firstname }}
            </router-link>
          </template>
          <template #item.customer.lastname="{ item }">
            <router-link
              :is="canAccessCustomer && item.customer.customer_id ? 'router-link' : 'span'"
              :to="{ name: 'customer-update', params: { id: item.customer.customer_id } }"
            >
              {{ item.customer.lastname }}
            </router-link>
          </template>
          <template #item.status="{ item }">
            <div class="d-flex flex-gap-8">
              <order-status-chip :value="item.status" />
              <order-status-chip v-if="item.customer.guest_id" value="guest" />
            </div>
          </template>
          <template #item.summary.total_due.amount="{ item }">
            <span>{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
          </template>
          <template #item.requested_delivery="{ item }">
            <span>{{ $format.requestedDelivery(item.requested_delivery) }}</span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.updated_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
          </template>
          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'single-order', params: { id: item.number } }"
            />
          </template>
          <template #item.delete="{ item }">
            <order-action-delete :value="item" icon :disabled="grid.loading" @success="onDeleteSuccess" />
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
import { OrderStatus } from '@futureecom/futureecom-js/dist/services/order-service'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import OrderActionDelete from '@/components/domains/orders/actions/OrderActionDelete.vue'
import OrderStatusChip from '@/components/domains/orders/OrderStatusChip.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { OrderGridRequest } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'Orders',

  components: { OrderStatusChip, OrderActionDelete, ButtonAction, TablePagination, Scrollable, ResourceGrid },

  setup() {
    const { t } = useI18n()

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const params = useQueryFromUrl<OrderGridRequest>({ sort: ['-created_at'] })

    const { canUpdate, canDelete } = useCrudChecker('orders\\order')

    const { canCreate: canCreateCart } = useCrudChecker('cart\\cart')
    const {
      canRead: canReadCustomer,
      canUpdate: canUpdateCustomer,
      canDelete: canDeleteCustomer
    } = useCrudChecker('customers\\customer')

    const canAccessCustomer = computed(() => {
      return canReadCustomer.value && (canUpdateCustomer.value || canDeleteCustomer.value)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: OrderGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.orders
        .orders(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Number'), value: 'number' },
        { text: t('First name'), value: 'customer.firstname' },
        { text: t('Last name'), value: 'customer.lastname' },
        { text: t('Order Status'), value: 'status' },
        { text: t('Item Count'), value: 'summary.total_items_count' },
        { text: t('Total'), value: 'summary.total_due.amount' },
        { text: t('Created By'), value: 'created_by.name' },
        { text: t('Created From'), value: 'created_by.from' },
        { text: t('Delivery method'), value: 'shipping.name', sortable: false },
        { text: t('Requested Delivery Date'), value: 'requested_delivery' },
        { text: t('Purchase order'), value: 'purchase_order' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'customer.firstname', label: t('First name') },
        { type: 'text', code: 'customer.lastname', label: t('Last name') },
        {
          type: 'select-multiple',
          code: 'status',
          label: t('Status'),
          options: [
            { text: t('placed'), value: OrderStatus.PLACED },
            { text: t('approved'), value: OrderStatus.APPROVED },
            { text: t('processing'), value: OrderStatus.PROCESSING },
            { text: t('on_hold'), value: OrderStatus.ON_HOLD },
            { text: t('refunded'), value: OrderStatus.REFUNDED },
            { text: t('shipped'), value: OrderStatus.SHIPPED },
            { text: t('canceled'), value: OrderStatus.CANCELED },
            { text: t('completed'), value: OrderStatus.COMPLETED }
          ]
        },
        { type: 'money-range', code: 'summary.total_due.amount', label: t('Price Amount') },
        { type: 'text', code: 'number', label: t('Number') },
        { type: 'text', code: 'requested_delivery', label: t('Requested delivery') },
        { type: 'text', code: 'created_by.name', label: t('Created By') },
        {
          type: 'select-multiple',
          code: 'created_by.from',
          label: t('Created From'),
          options: [
            { text: t('Storefront'), value: 'storefront' },
            { text: t('Point of Sale'), value: 'pos' },
            { text: t('Console'), value: 'console' },
            { text: t('API'), value: 'api' }
          ]
        },
        { type: 'date', code: 'created_at', label: t('Created at') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    return {
      params,
      options,
      grid,
      canAccessCustomer,
      canCreateCart,
      reloadCollection,
      onDeleteSuccess
    }
  }
})
</script>
