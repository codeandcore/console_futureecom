<template>
  <div class="flex-grow-1 d-flex justify-space-between align-center">
    <div class="mx-4 d-flex flex-column">
      <span>{{ value.name }}</span>
      <slot name="description" />
    </div>
    <div class="d-flex flex-gap-16 align-center">
      <div class="d-flex flex-column align-center">
        <span>+{{ $format.money.withStoreCurrency(value.price) }}</span>
        <span v-if="value.price_type === 'per_item'" class="text-caption">{{ $t('per item') }}</span>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'OrderableShippingMethodPreview',

  props: {
    value: {
      type: Object as PropType<Pick<Shipping, 'name' | 'price' | 'price_type'>>,
      required: true
    }
  }
})
</script>
