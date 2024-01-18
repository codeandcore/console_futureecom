<template>
  <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="ma-0 pa-0">
        <div class="text-caption d-flex justify-space-between">
          <span>{{ $t('Taxes') }}:</span>
          <span>{{ $format.money.withStoreCurrency(value.total_taxes) }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="text-caption ma-0 pa-0">
        <div v-for="itemTax of value.taxes" :key="itemTax.code" class="d-flex justify-space-between">
          <span>{{ itemTax.name }} ({{ itemTax.code }} {{ movePointerPosition(itemTax.rate, 2) }}%)</span>
          <span>{{ $format.money.withStoreCurrency(itemTax.tax) }}</span>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import movePointerPosition from '@/libs/movePointerPosition'
import type { OrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewItemTaxes',

  props: {
    value: {
      type: Object as PropType<OrderableItem>,
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
