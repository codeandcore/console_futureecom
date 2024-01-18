<template>
  <div class="d-flex flex-column flex-gap-16">
    <span v-if="errors['payment_method']" class="error--text text-caption">{{ $t('Select payment method') }}</span>
    <cart-checkout-payment-method v-model="paymentMethod" @input="onPaymentMethodInput" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CartCheckoutPaymentMethod from '@/components/domains/carts/checkout/CartCheckoutPaymentMethod.vue'
import type { OrderableCheckout } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartPaymentMethod',

  components: { CartCheckoutPaymentMethod },

  props: {
    checkout: {
      type: Object as PropType<OrderableCheckout>,
      required: true
    },
    errors: {
      type: Object as PropType<{ [key: string]: unknown; payment_method: string }>,
      required: true
    }
  },

  emits: ['update:checkout'],

  setup(props, { root, emit }) {
    const paymentMethod = computed({
      get: () => props.checkout.payment_method || '',
      set: (payment_method) => emit('update:checkout', { ...props.checkout, payment_method })
    })

    const onPaymentMethodInput = (): void => root.$toast.addSuccessToast(root.$t('Payment method has been set'))

    return {
      onPaymentMethodInput,
      paymentMethod
    }
  }
})
</script>
