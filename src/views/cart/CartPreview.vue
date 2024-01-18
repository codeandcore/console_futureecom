<template>
  <div>
    <div v-for="(panel, index) in panels" :key="`preview-panel-${index}`">
      <component :is="panel" v-model="cart" :readonly="readonly" />
      <v-divider :key="`cart-expansion-divider-${index}`" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { hasAddress, isCustomer, isGuest } from '@/libs/domains/carts/orderableHelpers'
import OrderableAddressPreview from '@/components/domains/carts/preview/OrderableAddressPreview.vue'
import OrderablePreviewBillingAddress from '@/components/domains/carts/preview/OrderablePreviewBillingAddress.vue'
import OrderablePreviewCustomer from '@/components/domains/carts/preview/OrderablePreviewCustomer.vue'
import OrderablePreviewNote from '@/components/domains/carts/preview/OrderablePreviewNote.vue'
import OrderablePreviewProducts from '@/components/domains/carts/preview/OrderablePreviewProducts.vue'
import OrderablePreviewShippingAddress from '@/components/domains/carts/preview/OrderablePreviewShippingAddress.vue'
import OrderablePreviewSummary from '@/components/domains/carts/preview/OrderablePreviewSummary.vue'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartPreview',

  components: {
    OrderableAddressPreview,
    OrderablePreviewNote,
    OrderablePreviewSummary,
    OrderablePreviewProducts,
    OrderablePreviewCustomer
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const cart = computed({
      get: (): Orderable => props.value,
      set: (val) => emit('input', val)
    })

    const panels = computed(() => {
      const panels = []

      if ((cart.value.items || []).length) {
        panels.push(OrderablePreviewSummary)
        panels.push(OrderablePreviewProducts)
      }

      if (cart.value.note) {
        panels.push(OrderablePreviewNote)
      }

      const customer = cart.value.customer

      if (isGuest(customer) || isCustomer(customer)) {
        panels.push(OrderablePreviewCustomer)
      }

      if (hasAddress(cart.value, 'shipping_address')) {
        panels.push(OrderablePreviewShippingAddress)
      }

      if (hasAddress(cart.value, 'billing_address')) {
        panels.push(OrderablePreviewBillingAddress)
      }

      return panels
    })

    return {
      cart,
      panels
    }
  }
})
</script>
