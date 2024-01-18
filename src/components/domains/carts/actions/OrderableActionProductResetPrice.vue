<template>
  <button-action v-bind="{ ...$attrs, loading, color: 'primary' }" @click.stop="resetPriceHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import useApi from '@/composable/useApi'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableActionProductResetPrice',

  components: { ButtonAction },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    productId: {
      type: String,
      default: ''
    }
  },

  emits: ['update:loading'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const api = useApi()

    const resetAllPricesHandler = (): Promise<Orderable> => {
      return props.productId
        ? api.carts.resetItemsInOrderable(props.value, [props.productId])
        : api.carts.resetAllItemsInOrderable(props.value)
    }

    const resetPriceHandler = (): void => {
      loading.value = true
      emitLoadingState()

      resetAllPricesHandler()
        .then((val) => {
          addSuccessToast(t('Prices have been resetted'))
          emit('input', val)
        })
        .catch((err) => emitOrderableError(err, t('Unable to reset prices')))
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      resetPriceHandler
    }
  }
})
</script>
