<template>
  <v-btn
    depressed
    small
    color="primary"
    :loading="loading"
    data-cy="order-action-capture-payment-btn"
    @click="capturePayment"
  >
    {{ $t('Capture payment') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionCapturePayment',

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)
    const api = useApi()

    const capturePayment = async (): Promise<void> => {
      loading.value = true

      try {
        await api.payments.captureAuthorization(props.transactionId)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Payment has been captured'))
      } catch {
        addErrorToast(t('Unable to capture payment'))
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      capturePayment
    }
  }
})
</script>
