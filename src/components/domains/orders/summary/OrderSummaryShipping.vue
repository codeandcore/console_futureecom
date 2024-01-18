<template>
  <div class="d-flex flex-column flex-gap-16 mx-4">
    <div class="d-flex flex-column">
      <span>{{ value.name }}</span>
      <small class="text-capitalize">{{ $t('Type') }}: {{ value.type }}</small>
    </div>
    <div class="d-flex justify-space-between">
      <span class="text-capitalize">{{ $t('Price Type') }}: {{ $t(value.price_type.replace('_', ' ')) }}</span>
      <span class="mx-2">{{ $format.money.withStoreCurrency(value.price) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { OrderShipping } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderSummaryShipping',

  props: {
    value: {
      type: Object as PropType<OrderShipping>,
      required: true
    }
  }
})
</script>
