<template>
  <v-expansion-panels v-if="value.billing_address" flat :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header class="text-h6">
        {{ $t('Billing address') }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <orderable-address-preview :value="value.billing_address" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import OrderableAddressPreview from '@/components/domains/carts/preview/OrderableAddressPreview.vue'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewBillingAddress',
  components: { OrderableAddressPreview },
  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  }
})
</script>
