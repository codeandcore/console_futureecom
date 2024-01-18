<template>
  <v-expansion-panels v-model="sectionIndex" flat>
    <v-expansion-panel v-for="(step, index) in sections" :key="`cart-section-expansion-${index}`">
      <v-expansion-panel-header class="text-h6">
        <div class="d-flex align-center flex-gap-8">
          <v-icon v-if="hasErrorAt(step.code).value" color="error">error</v-icon>
          <span>{{ $t(step.name) }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card :disabled="step.readonly" flat>
          <component
            :is="step.component"
            v-if="sectionIndex === index"
            v-model="cart"
            class="d-flex flex-column flex-gap-16"
            :customer.sync="cartCustomer"
            :checkout.sync="cartCheckout"
            :errors="errors"
          />
        </v-card>
      </v-expansion-panel-content>
      <v-divider />
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import CartBillingAddress from '@/views/cart/sections/CartBillingAddress.vue'
import CartCoupon from '@/views/cart/sections/CartCoupon.vue'
import CartItems from '@/views/cart/sections/CartItems.vue'
import CartNote from '@/views/cart/sections/CartNote.vue'
import CartPaymentMethod from '@/views/cart/sections/checkout/CartPaymentMethod.vue'
import CartPurchaseOrder from '@/views/cart/sections/checkout/CartPurchaseOrder.vue'
import CartRequestedDelivery from '@/views/cart/sections/checkout/CartRequestedDelivery.vue'
import CartShippingAddress from '@/views/cart/sections/CartShippingAddress.vue'
import OrderableShippingMethod from '@/views/cart/sections/OrderableShippingMethod.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type {
  Orderable,
  OrderableCheckout,
  OrderableGuestDetails,
  Quote
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { OrderableSections } from '@/types/Orderable'
import type { PropType } from '@vue/composition-api'
import type { TabNavigationComponent } from '@/composable/useTabsRoute'
import type { ValidationErrors } from '@/types/validator'

interface CartQuoteSections extends TabNavigationComponent<OrderableSections> {
  readonly: boolean
}

export default defineComponent({
  name: 'CartSectionSteps',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    customer: {
      type: Object as PropType<OrderableGuestDetails | CustomerDetailsResponse>,
      required: true
    },
    checkout: {
      type: Object as PropType<OrderableCheckout | undefined>,
      default: () => ({})
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  emit: ['update:customer', 'update:checkout'],

  setup(props, { emit }) {
    const sectionIndex = ref(0)

    const cart = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })
    const cartCustomer = computed({
      get: () => props.customer,
      set: (value) => emit('update:customer', value)
    })
    const cartCheckout = computed({
      get: () => props.checkout,
      set: (value) => emit('update:checkout', value)
    })

    const { getSettings } = useSettings()
    const checkoutSetting = getSettings<CheckoutSettings>('general.checkout')

    const checkoutSections = ['payment_method', 'requested_delivery', 'purchase_order']

    const defaultSections = computed(() => {
      const val: TabNavigationComponent<OrderableSections>[] = [
        { code: 'products', name: 'Products', component: CartItems },
        {
          code: 'shipping_address',
          name: 'Shipping Address',
          component: CartShippingAddress
        },
        {
          code: 'billing_address',
          name: 'Billing Address',
          component: CartBillingAddress
        },
        { code: 'shipping', name: 'Shipping Method', component: OrderableShippingMethod },
        { code: 'coupon', name: 'Coupon', component: CartCoupon },
        { code: 'note', name: 'Order Note', component: CartNote },
        { code: 'payment_method', name: 'Payment Method', component: CartPaymentMethod }
      ]

      if (checkoutSetting.value.requesting_delivery_allowed) {
        val.push({ code: 'requested_delivery', name: 'Requested delivery date', component: CartRequestedDelivery })
      }

      if (checkoutSetting.value.purchase_order_allowed) {
        val.push({ code: 'purchase_order', name: 'Purchase order', component: CartPurchaseOrder })
      }

      return val
    })

    const sections = computed((): CartQuoteSections[] => {
      const isQuote = (val: any): val is Quote => cart.value.type === 'quote'

      if (!isQuote(cart.value)) {
        return defaultSections.value.map((item) => ({ ...item, readonly: false }))
      }

      if (isQuote(cart.value) && cart.value.status === 'approved') {
        return defaultSections.value.map((item) => ({ ...item, readonly: !checkoutSections.includes(item.code) }))
      }

      return defaultSections.value
        .map((item) => ({ ...item, readonly: props.readonly }))
        .filter((item) => !checkoutSections.includes(item.code))
    })

    const hasErrorAt = (code: string) => computed(() => !!props.errors[code])

    return {
      sections,
      cart,
      cartCustomer,
      cartCheckout,
      sectionIndex,
      hasErrorAt
    }
  }
})
</script>
