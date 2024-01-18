<template>
  <div>
    <div class="d-flex flex-column">
      <span class="text-subtitle-2">{{ value.name }}</span>
      <span class="my-1 grey--text">
        {{ $t('Discount type') }}:
        <span class="text-capitalize">{{ value.discount_type }}</span>
      </span>
      <span>
        {{ $t('Rate type') }}:
        <span class="text-capitalize">{{ value.rate_type }}</span>
        <span v-if="value.rate_type === 'percentage'">({{ value.rate }}%)</span>
      </span>
      <span v-if="value.code" class="grey--text">{{ $t('Code') }}: {{ value.code }}</span>
    </div>
    <span>-{{ $format.money.withStoreCurrency(value.discount) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Discount } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'OrderSummaryDiscountBreakdown',

  props: {
    value: {
      type: Object as () => Discount,
      required: true
    }
  }
})
</script>
