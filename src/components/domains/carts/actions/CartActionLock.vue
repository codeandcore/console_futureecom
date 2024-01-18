<template>
  <v-select
    v-model="lockState"
    item-text="title"
    color="primary"
    :label="$t('Cart Lock State')"
    :items="lockActions"
    :loading="loading"
    :disabled="loading"
    outlined
    dense
    hide-details="auto"
  />
</template>

<script lang="ts">
import { CartLockState } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Cart } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartActionLock',

  props: {
    value: {
      type: Object as PropType<Cart>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const loading = ref(false)

    const lockState = computed({
      get: () => props.value.lock_state,
      set: (newState: CartLockState) => {
        lockHandler(newState)
      }
    })

    const lockHandler = (newState: CartLockState) => {
      loading.value = true

      const fn =
        newState === CartLockState.UNLOCKED
          ? (): Promise<Cart> => api.carts.unlockCart(props.value.id)
          : (): Promise<Cart> => api.carts.lockCart(props.value.id, newState)

      fn()
        .then((val) => {
          emit('input', val)
          addSuccessToast(t('The cart was updated'))
        })
        .catch((err) => {
          emitOrderableError(err, err.response?.data.message || t('Unable to update cart'))
        })
        .finally(() => {
          loading.value = false
        })
    }

    const lockActions = [
      {
        title: 'Unlocked',
        value: CartLockState.UNLOCKED
      },
      {
        title: 'Locked',
        value: CartLockState.LOCKED
      },
      {
        title: 'Management',
        value: CartLockState.MANAGEMENT
      },
      {
        title: 'Checkout',
        value: CartLockState.CHECKOUT
      }
    ]

    return {
      loading,
      lockActions,
      lockState
    }
  }
})
</script>
