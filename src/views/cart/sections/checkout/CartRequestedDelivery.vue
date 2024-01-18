<template>
  <div class="d-flex flex-column">
    <cart-requested-delivery-date v-model="requestedDelivery" />
    <cart-requested-delivery-time
      v-if="showDeliveryTime"
      v-model="requestedDelivery"
      :disabled="disabledTime"
      persistent-hint
      :hint="disabledTime ? $t('Select date first') : ''"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useDate } from '@/composable/useDate'
import { useSettings } from '@/composable/repositories/useSettings'
import CartRequestedDeliveryDate from '@/components/domains/carts/checkout/CartCheckoutRequestedDeliveryDate.vue'
import CartRequestedDeliveryTime from '@/components/domains/carts/checkout/CartCheckoutRequestedDeliveryTime.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { OrderableCheckout } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartRequestedDelivery',

  components: { CartRequestedDeliveryTime, CartRequestedDeliveryDate },

  props: {
    checkout: {
      type: Object as PropType<OrderableCheckout>,
      required: true
    }
  },

  emits: ['update:checkout'],

  setup(props, { emit }) {
    const { getSettings } = useSettings()
    const { getDate } = useDate()

    const settingCode = 'general.checkout.show_delivery_time'
    const showDeliveryTime = getSettings<CheckoutSettings['show_delivery_time']>(settingCode).value

    const requestedDelivery = computed({
      get: () => props.checkout.requested_delivery || '',
      set: (requested_delivery) => emit('update:checkout', { ...props.checkout, requested_delivery })
    })

    const disabledTime = computed(() => !getDate(requestedDelivery.value))

    return {
      requestedDelivery,
      showDeliveryTime,
      disabledTime
    }
  }
})
</script>
