<template>
  <div>
    <div v-for="(shipment, shipmentIndex) in value.shipments" :key="`shipment-${shipmentIndex}`">
      <v-divider v-if="shipmentIndex > 0" class="my-4" />

      <v-card flat>
        <v-card-text class="d-flex flex-column">
          <div class="d-flex flex-column">
            <span class="font-weight-medium">{{ $t('Carrier') }}: {{ shipment.carrier || 'N/A' }}</span>
            <span class="font-weight-medium">{{ $t('Tracking ID') }}: {{ shipment.tracking_number || 'N/A' }}</span>
          </div>
          <span v-if="shipment.notes" class="mt-3">{{ $t('Notes') }}: {{ shipment.notes }}</span>
        </v-card-text>
      </v-card>

      <div class="mx-4 mt-2">
        <div v-for="item in shipment.items" :key="item.item_id" class="d-flex align-center">
          <span class="me-3">{{ item.quantity }}x</span>
          <order-item-preview :value="getItem(item.item_id).value" class="d-flex align-center" />
        </div>
      </div>
      <div class="mx-4 mt-4 d-flex justify-space-between">
        <div>
          <span>{{ $t('Shipping to') }}:</span>
          <full-address-preview v-if="shipment.to" class="text-caption" :value="shipment.to" />
        </div>
        <div class="d-flex flex-column text-caption">
          <span>{{ $t('Created At') }}: {{ $format.timezone.getFormattedTime(shipment.created_at) }}</span>
          <span>{{ $t('Updated At') }}: {{ $format.timezone.getFormattedTime(shipment.updated_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import FullAddressPreview from '@/components/common/AddressPreview.vue'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import type { Order, OrderItem } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderShipmentsPreview',
  components: { FullAddressPreview, OrderItemPreview },
  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  },

  setup(props) {
    const getItem = (item_id: string) => {
      return computed((): OrderItem => props.value.items?.find((item) => item.id === item_id) as OrderItem)
    }

    return {
      getItem
    }
  }
})
</script>
