<template>
  <div class="d-flex justify-space-between align-center flex-gap-16 mx-4">
    <div class="d-flex flex-column">
      <span>{{ value.name }}</span>
      <small class="text-capitalize">{{ $t('Rate') }}: {{ movePointerPosition(value.rate, 2) }}%</small>
    </div>
    <div class="d-flex justify-space-between">
      {{ $format.money.withStoreCurrency(value.tax) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import movePointerPosition from '@/libs/movePointerPosition'
import type { PropType } from '@vue/composition-api'
import type { Tax } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'OrderSummaryTaxes',

  props: {
    value: {
      type: Object as PropType<Tax>,
      required: true
    }
  },

  setup() {
    return {
      movePointerPosition
    }
  }
})
</script>
