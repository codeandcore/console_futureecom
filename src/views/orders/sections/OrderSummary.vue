<template>
  <div class="d-flex flex-column">
    <order-expansion-list
      :amount="includesDiscount ? value.summary.total_new_items_amount : value.summary.total_items_amount"
      show-expand
    >
      <template #title>
        <div class="d-flex flex-column flex-gap-4">
          <span>{{ `Items (${value.summary.total_items_count})` }}</span>
          <span v-if="includesDiscount" class="text-caption">({{ $t('includes discounts') }})</span>
        </div>
      </template>
      <template #before-icon>
        <v-chip color="primary" small>
          <span v-if="includesDiscount">
            {{ $format.money.withStoreCurrency(value.summary.total_new_items_amount) }}
          </span>
          <span v-else>{{ $format.money.withStoreCurrency(value.summary.total_items_amount) }}</span>
        </v-chip>
      </template>
      <template #content>
        <order-summary-item v-for="item in value.items || []" :key="item.id" :value="item" class="ma-4" />
      </template>
    </order-expansion-list>

    <v-divider />

    <order-expansion-list show-expand>
      <template #title>
        <div class="d-flex flex-column flex-gap-4">
          <span>{{ `Shipping` }}</span>
          <span v-if="includesDiscount" class="text-caption">({{ $t('includes discounts') }})</span>
        </div>
      </template>
      <template #before-icon>
        <v-chip color="primary" small>
          <span v-if="includesDiscount">{{ $format.money.withStoreCurrency(value.summary.total_new_shipping) }}</span>
          <span v-else>{{ $format.money.withStoreCurrency(value.summary.total_shipping) }}</span>
        </v-chip>
      </template>
      <template #content>
        <order-summary-shipping :value="value.shipping" />
      </template>
    </order-expansion-list>

    <v-divider />

    <order-expansion-list :title="`Discounts`" :show-expand="value.summary.total_discount.amount > 0">
      <template #content>
        <order-summary-discounts :value="value" class="d-flex justify-space-between" />
      </template>
      <template #before-icon>
        <v-chip color="primary" small>- {{ $format.money.withStoreCurrency(value.summary.total_discount) }}</v-chip>
      </template>
    </order-expansion-list>

    <v-divider />

    <order-expansion-list :title="`Taxes`" :amount="value.summary.total_taxes" :show-expand="value.taxes.length > 0">
      <template #content>
        <order-summary-taxes v-for="item in value.taxes || []" :key="item.id" :value="item" class="ma-4" />
      </template>
      <template #before-icon>
        <v-chip color="primary" small>
          {{ $format.money.withStoreCurrency(value.summary.total_taxes) }}
        </v-chip>
      </template>
    </order-expansion-list>

    <v-divider />

    <template v-if="value.summary.total_refunded.amount > 0">
      <order-expansion-list :title="`Refunded`">
        <template #before-icon>
          <v-chip color="primary" small>
            {{ $format.money.withStoreCurrency(value.summary.total_refunded) }}
          </v-chip>
        </template>
      </order-expansion-list>
      <v-divider class="mb-4" />
    </template>

    <v-card color="primary" dark flat>
      <v-card-text class="d-flex justify-space-between font-weight-bold white--text">
        <span>{{ $t('Total') }}</span>
        <span>{{ $format.money.withStoreCurrency(value.summary.total_due) }}</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import OrderExpansionList from '@/components/domains/orders/summary/OrderExpansionList.vue'
import OrderSummaryDiscounts from '@/components/domains/orders/summary/OrderSummaryDiscounts.vue'
import OrderSummaryItem from '@/components/domains/orders/summary/OrderSummaryItem.vue'
import OrderSummaryShipping from '@/components/domains/orders/summary/OrderSummaryShipping.vue'
import OrderSummaryTaxes from '@/components/domains/orders/summary/OrderSummaryTaxes.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderSummary',
  components: { OrderSummaryShipping, OrderSummaryDiscounts, OrderSummaryTaxes, OrderExpansionList, OrderSummaryItem },
  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  },

  setup(props) {
    const includesDiscount = computed(() => {
      const hasDiscount = props.value.tax_type === 'vat' && props.value.discount_after_tax && props.value.vat_in_price
      const hasItemsDiscount = props.value.summary.total_items_discount.amount > 0
      return hasDiscount && hasItemsDiscount
    })

    return {
      includesDiscount
    }
  }
})
</script>
