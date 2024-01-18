<template>
  <div class="d-flex justify-space-between">
    <order-item-preview class="d-flex" :value="value" />
    <div class="d-flex flex-column align-end">
      <span class="text-caption">{{ value.quantity }} x {{ $format.money.withStoreCurrency(value.real_price) }}</span>
      <span>{{ $format.money.withStoreCurrency(value.subtotal) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import type { OrderItem } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderSummaryItems',
  components: { OrderItemPreview },
  props: {
    value: {
      type: Object as () => OrderItem,
      required: true
    }
  }
})
</script>
