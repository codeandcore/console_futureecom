<template>
  <div class="d-flex flex-column mt-2">
    <div v-if="value.summary.total_items_discount.amount > 0" class="mx-4">
      <div class="d-flex justify-space-between">
        <span class="text-body-1 mb-4">{{ $t('Item Discounts') }}</span>
        <span class="mx-2">- {{ $format.money.withStoreCurrency(value.summary.total_items_discount) }}</span>
      </div>
      <div v-for="(item, itemIndex) in value.items" :key="item.id" class="">
        <div
          v-for="(discount, discountIndex) in item.discounts"
          :key="`${discount.code}-${discountIndex}`"
          class="mx-2"
        >
          <v-divider v-if="itemIndex > 0" class="my-2" />
          <router-link :to="{ name: 'product-update', params: { id: item.product_id } }">
            {{ item.name }}
          </router-link>
          <order-summary-discount-breakdown
            :value="discount"
            class="d-flex align-center justify-space-between ms-4 text-caption mb-2"
          />
        </div>
      </div>
    </div>
    <div v-if="value.summary.total_shipping_discount.amount > 0">
      <div class="d-flex justify-space-between">
        <span class="text-body-1 mb-4">{{ $t('Shipping Discounts') }}</span>
        <span class="mx-2">- {{ $format.money.withStoreCurrency(value.summary.total_shipping_discount) }}</span>
      </div>
      <div
        v-for="(discount, shippingDiscountIndex) in value.shipping"
        :key="`${discount.code}-${shippingDiscountIndex}`"
        class="mx-2"
      >
        <v-divider v-if="shippingDiscountIndex > 0" class="my-2" />
        <order-summary-discount-breakdown
          :value="discount"
          class="d-flex align-center justify-space-between ms-4 text-caption mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import OrderSummaryDiscountBreakdown from '@/components/domains/orders/summary/OrderSummaryDiscountBreakdown.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderSummaryDiscounts',

  components: { OrderSummaryDiscountBreakdown },

  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  }
})
</script>
