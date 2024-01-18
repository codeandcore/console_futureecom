<template>
  <v-btn
    depressed
    small
    color="primary"
    :loading="loading"
    data-cy="order-action-mark-as-paid-btn"
    @click="markAsPaidHandler"
  >
    {{ $t('Mark as Paid') }}
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
  name: 'OrderActionMarkAsPaid',
  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)

    const markAsPaidHandler = async (): Promise<void> => {
      loading.value = true

      try {
        await api.orders.markAsPaidOrder(props.value.number)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Order marked as paid'))
      } catch (e) {
        addErrorToast(t('Unable to mark as paid'))
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      markAsPaidHandler
    }
  }
})
</script>
