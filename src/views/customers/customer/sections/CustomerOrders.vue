<template>
  <div>
    <v-container v-if="!canRead && !canCreate">
      <div class="d-flex justify-center">
        <restricted />
      </div>
    </v-container>
    <resource-grid
      v-else-if="canRead"
      v-model="params"
      :options="options"
      :items="items"
      class="ma-4 justify-center"
      @onParamsChange="reloadCollection"
    >
      <template #item.number="{ item }">
        <v-btn text class="no-uppercase" :to="{ name: 'single-order', params: { id: item.number } }">
          {{ item.number }}
        </v-btn>
      </template>
      <template #item.customer="{ item }">
        <router-link
          :is="item.customer.customer_id ? 'router-link' : 'span'"
          :to="{ name: 'customer-update', params: { id: item.customer.customer_id } }"
        >
          {{ item.customer.firstname }}
          {{ item.customer.lastname }}
        </router-link>
      </template>
      <template #item.status="{ item }">
        <order-status-chip :value="item.status" />
        <order-status-chip v-if="item.customer.guest_id" value="guest" />
      </template>
      <template #item.summary.total_due="{ item }">
        <span>{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
      </template>
      <template #item.created_at="{ item }">
        <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
      </template>
      <template #item.updated_at="{ item }">
        <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
      </template>
    </resource-grid>
    <div class="d-flex justify-end">
      <v-btn
        color="primary"
        :disabled="!canCreate || !value.id"
        small
        depressed
        :loading="loadingCreate"
        @click="createCart"
      >
        {{ $t('Create order') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { OrderStatus } from '@futureecom/futureecom-js/dist/services/order-service'
import { computed, defineComponent, ref } from '@vue/composition-api'
import OrderStatusChip from '@/components/domains/orders/OrderStatusChip.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Restricted from '@/views/Restricted.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { CustomerResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { OrderGridRequest } from '@futureecom/futureecom-js/dist/services/order-service'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CustomerOrders',

  components: { OrderStatusChip, ResourceGrid, Restricted },

  props: {
    value: {
      type: Object as () => CustomerResponse,
      required: true
    }
  },

  setup(props, { root }) {
    const api = useApi()
    const collection = collectionLoader()

    const params = ref<GridRequest>()

    const canCreate = computed(() => root.$canAny('manage,orders\\order', 'create,orders\\order').value)
    const canRead = computed(() => root.$canAny('manage,orders\\order', 'read,orders\\order').value)

    const loadingCreate = ref(false)

    const createCart = () => {
      loadingCreate.value = true
      api.carts
        .createCart({ customer: { customer_id: props.value.id } })
        .then((val) => {
          root.$toast.addSuccessToast(root.$t(`Created cart for ${props.value.firstname} ${props.value.lastname}`))
          root.$router.push({ name: 'cart-update', params: { id: val.id } })
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to create cart')))
        .finally(() => (loadingCreate.value = false))
    }

    const reloadCollection = (params: OrderGridRequest): void => {
      collection.loadCollection(() =>
        api.orders.orders({
          sort: params.sort,
          filter: {
            ...params.filter,
            'customer.customer_id': props.value.id
          }
        })
      )
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Number'), value: 'number' },
        { text: ctx.$t('Name'), value: 'customer' },
        { text: ctx.$t('Order Status'), value: 'status' },
        { text: ctx.$t('Updated At'), value: 'updated_at' },
        { text: ctx.$t('Item Count'), value: 'summary.total_items_count' },
        { text: ctx.$t('Price'), value: 'summary.total_due' },
        { text: ctx.$t('Created By'), value: 'created_by.name' },
        { text: ctx.$t('Created From'), value: 'created_by.from' },
        { text: ctx.$t('Requested Delivery Date'), value: 'requested_delivery' },
        { text: ctx.$t('Purchase order'), value: 'purchase_order' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        {
          type: 'select-multiple',
          code: 'status',
          label: ctx.$t('Status'),
          options: [
            { text: ctx.$t('placed'), value: OrderStatus.PLACED },
            { text: ctx.$t('approved'), value: OrderStatus.APPROVED },
            { text: ctx.$t('processing'), value: OrderStatus.PROCESSING },
            { text: ctx.$t('on_hold'), value: OrderStatus.ON_HOLD },
            { text: ctx.$t('refunded'), value: OrderStatus.REFUNDED },
            { text: ctx.$t('shipped'), value: OrderStatus.SHIPPED },
            { text: ctx.$t('canceled'), value: OrderStatus.CANCELED },
            { text: ctx.$t('completed'), value: OrderStatus.COMPLETED }
          ]
        },
        { type: 'range', code: 'summary.total_due.amount', label: ctx.$t('Price Amount') },
        { type: 'text', code: 'number', label: ctx.$t('Number') },
        { type: 'text', code: 'requested_delivery', label: ctx.$t('Requested delivery') },
        { type: 'text', code: 'created_by.name', label: ctx.$t('Created By') },
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
        { type: 'text', code: 'comments.text', label: ctx.$t('Comment text') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created at') },
        { type: 'date', code: 'updated_at', label: ctx.$t('Updated at') }
      ]

      return {
        headers,
        filters,
        meta: collection.metadata.value,
        loading: collection.loading.value
      }
    })

    return {
      params,
      reloadCollection,
      options,
      items: collection.data,
      canCreate,
      canRead,
      createCart,
      loadingCreate
    }
  }
})
</script>
