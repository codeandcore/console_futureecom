<template>
  <v-btn v-bind="$attrs" :loading="loading" color="primary" depressed @click.prevent="checkoutHandler">
    {{ $t('Checkout') }}
  </v-btn>
</template>

<script lang="ts">
import { EventType } from '@futureecom/futureecom-js/dist/ws/events'
import { defineComponent, ref } from '@vue/composition-api'
import { getCheckoutCustomer } from '@/libs/domains/carts/orderableHelpers'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Orderable, OrderableCheckout } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableCheckout',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    checkout: {
      type: Object as PropType<OrderableCheckout>,
      required: true
    },
    isValid: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:loading', 'update:triedToCheckout'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()

    const triedToCheckout = ref(false)

    const loading = ref(false)
    const redirectionRetries = ref(0)
    const MAX_RETRIES = 3

    const emitLoadingState = () => emit('update:loading', loading.value)

    const api = useApi()

    const redirectToOrder = (id: string) => router.push({ name: 'single-order', params: { id } })

    const checkoutHandler = (): void => {
      triedToCheckout.value = true
      emit('update:tried-to-checkout', triedToCheckout.value)

      if (!props.isValid) {
        return
      }

      loading.value = true
      emitLoadingState()

      const checkout = { ...props.checkout, customer: getCheckoutCustomer(props.value) }

      api.carts
        .checkoutOrderable(props.value, checkout)
        .then(() => {
          addSuccessToast(t('Checkout success! Redirecting...'))
          api.config.ws ? orderCreatedListener() : tryToRedirect(props.value.id)
        })
        .catch((err) => {
          const { message, errors } = err.response?.data.message || {}
          addErrorToast(message || t('Unable to checkout'))
          emit('update:errors', errors)
        })
    }

    const orderCreatedListener = () => {
      try {
        api.ws.subscribe({
          name: EventType.ORDER_CREATED,
          listener: (event: any) => {
            if (event.data.id) {
              redirectToOrder(event.data.id)
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const tryToRedirect = async (id: string) => {
      await sleep(1500)

      redirectionRetries.value += 1

      api.orders
        .getOrder(id)
        .then(() => redirectToOrder(id))
        .catch(() => {
          if (redirectionRetries.value >= MAX_RETRIES) {
            router.push({ name: 'orders' })
            return
          }
          tryToRedirect(id)
        })
    }

    return {
      loading,
      checkoutHandler
    }
  }
})
</script>
