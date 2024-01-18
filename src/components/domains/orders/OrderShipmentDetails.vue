<template>
  <div>
    <v-card flat>
      <v-card-text class="d-flex justify-space-between">
        <div class="d-flex flex-column">
          <span class="font-weight-medium">{{ $t('Carrier') }}: {{ value.carrier || 'N/A' }}</span>
          <span class="font-weight-medium">{{ $t('Tracking ID') }}: {{ value.tracking_number || 'N/A' }}</span>
          <span v-if="value.notes" class="mt-3">{{ $t('Notes') }}: {{ value.notes }}</span>
        </div>
        <slot name="actions" />
      </v-card-text>
    </v-card>

    <div class="mx-4 mt-2">
      <div v-for="item in value.items" :key="item.item_id" class="d-flex align-center">
        <span class="me-3">{{ item.quantity }}x</span>
        <order-item-preview :value="getItem(item.item_id).value" class="d-flex align-center" />
      </div>
    </div>
    <div class="mx-4 mt-4 d-flex justify-space-between flex-gap-16">
      <div>
        <span>{{ $t('Shipping to') }}:</span>
        <full-address-preview v-if="value.to" class="text-caption" :value="value.to" />
      </div>
      <div class="d-flex flex-column text-caption flex-gap-8">
        <span>{{ $t('Created At') }}: {{ $format.timezone.getFormattedTime(value.created_at) }}</span>
        <span>{{ $t('Updated At') }}: {{ $format.timezone.getFormattedTime(value.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import FullAddressPreview from '@/components/common/AddressPreview.vue'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import type { Order, OrderShipment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentDetails',
  components: { FullAddressPreview, OrderItemPreview },
  props: {
    value: {
      type: Object as PropType<OrderShipment>,
      required: true
    },
    order: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props) {
    const getItem = (item_id: string) => computed(() => (props.order.items || [])?.find((item) => item.id === item_id))

    return {
      getItem
    }
  }
})
</script>
