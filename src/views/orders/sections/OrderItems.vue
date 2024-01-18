<template>
  <div class="d-flex flex-column flex-gap-8">
    <h2>{{ $t('Shipping Details') }}</h2>
    <span>
      {{ value.shipping.name }}
    </span>
    <span>
      {{ $t('Type') }}:
      <span class="text-capitalize">{{ value.shipping.type }}</span>
    </span>

    <span v-if="value.requested_delivery">
      {{ $t('Requested delivery date') }}:
      <span class="text-capitalize">{{ $format.requestedDelivery(value.requested_delivery) }}</span>
    </span>

    <div>
      <v-btn
        v-if="!allOrderItemsShipped && $canAny('manage,orders\\order', 'update,orders\\shipment')"
        small
        depressed
        color="primary"
        :disabled="!canShipItems"
        @click.stop="openCreateDialog"
      >
        {{ $t('Ship items') }}
      </v-btn>
      <span v-else-if="allOrderItemsShipped">{{ $t('All items have been shipped') }}</span>
      <span v-if="!canShipItems">{{ $t('') }}</span>
    </div>

    <v-divider class="my-4" />

    <expandable-content :show-expand="hasItems">
      <template #title>
        <div class="d-flex flex-grow-1 justify-space-between align-center">
          <span>{{ $t('Items') }}</span>
        </div>
      </template>
      <template #content>
        <v-data-table class="mt-4" :items="value.items" :headers="headers" :items-per-page="-1" hide-default-footer>
          <template #item.shipped="{ item }">
            <span>{{ getShippedItemCount(item) }}</span>
          </template>
          <template #item.status="{ item }">
            <order-status-chip v-if="item.status" :value="item.status" />
          </template>
          <template #item.item="{ item }">
            <order-item-preview class="d-flex align-center my-3" :value="item" />
          </template>
        </v-data-table>
      </template>
    </expandable-content>

    <v-divider class="my-4" />

    <expandable-content :show-expand="hasOrderShipments">
      <template #title>
        <span>{{ $t('Shipments') }}</span>
      </template>
      <template #content>
        <div v-for="(shipment, shipmentIndex) in value.shipments" :key="`shipment-${shipmentIndex}`">
          <v-divider v-if="shipmentIndex > 0" class="my-4" />
          <order-shipment-details :order="value" :value="shipment">
            <template #actions>
              <v-btn depressed small color="primary" @click="openUpdateDialog(shipment)">
                {{ $t('Update') }}
              </v-btn>
            </template>
          </order-shipment-details>
        </div>
      </template>
    </expandable-content>

    <order-shipment-create
      :key="`create-${showDialog.create}`"
      v-model="showDialog.create"
      :order="value"
      @created="onCreated"
    />

    <order-shipment-update
      v-if="shipment"
      :key="`update-${showDialog.update}`"
      v-model="showDialog.update"
      :shipment="shipment"
      :order="value"
      @updated="$emit('update')"
    />
  </div>
</template>

<script lang="ts">
import { canFulfill } from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import {
  getShippedItemCount,
  hasAllItemsShipped,
  hasShipments
} from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import OrderShipmentCreate from '@/components/domains/orders/OrderShipmentCreate.vue'
import OrderShipmentDetails from '@/components/domains/orders/OrderShipmentDetails.vue'
import OrderShipmentUpdate from '@/components/domains/orders/OrderShipmentUpdate.vue'
import OrderStatusChip from '@/components/domains/orders/OrderStatusChip.vue'
import type { Order, OrderShipment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderItems',

  components: {
    OrderStatusChip,
    OrderShipmentUpdate,
    OrderShipmentDetails,
    OrderShipmentCreate,
    ExpandableContent,
    OrderItemPreview
  },
  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const showDialog = reactive({
      create: false,
      update: false
    })

    const shipment = ref<OrderShipment>()
    const hasItems = computed(() => (props.value.items || []).length > 0)

    const allOrderItemsShipped = computed((): boolean => hasAllItemsShipped(props.value))
    const hasOrderShipments = computed((): boolean => hasShipments(props.value))

    const headers = computed(() => [
      { text: root.$t('Item'), value: 'item' },
      { text: root.$t('Status'), value: 'status' },
      { text: root.$t('Total quantity'), value: 'quantity' },
      { text: root.$t('Shipped'), value: 'shipped' },
      { text: root.$t('Quantity refunded'), value: 'quantity_refunded' }
    ])

    const openCreateDialog = () => {
      showDialog.create = true
    }

    const onCreated = () => {
      showDialog.create = false
      emit('update')
    }

    const openUpdateDialog = (value: OrderShipment) => {
      shipment.value = value
      showDialog.update = true
    }

    const canShipItems = computed(() => canFulfill(props.value.status))

    return {
      hasOrderShipments,
      hasItems,
      headers,
      getShippedItemCount,
      allOrderItemsShipped,
      shipment,
      showDialog,
      openCreateDialog,
      openUpdateDialog,
      onCreated,
      canShipItems
    }
  }
})
</script>
