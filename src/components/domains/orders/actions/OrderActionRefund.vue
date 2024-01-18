<template>
  <v-dialog v-model="showRefundDialog" max-width="800" scrollable>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" depressed small color="error" v-on="on" @click="showRefundDialog = true">
        {{ $t('Refund') }}
      </v-btn>
    </template>
    <form-validator-wrapper @submit="refundHandler">
      <template #default>
        <v-card :key="showRefundDialog">
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Refund order') }}: {{ value.number }}</span>

            <v-icon size="32" @click="showRefundDialog = false">close</v-icon>
          </v-card-title>
          <v-divider />

          <v-card-text>
            <order-refund-inputs v-model="toBeRefunded" :order="value" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-space-between ma-2">
            <span v-if="totalRefund">{{ $t('Total refund') }}: {{ $format.money.withStoreCurrency(totalRefund) }}</span>
            <v-btn :disabled="!hasRefundableAmount" depressed color="primary" type="submit" :loading="loading">
              {{ $t('Refund') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import OrderRefundInputs from '@/components/domains/orders/OrderRefundInputs.vue'
import getOrderTotalRefund from '@/libs/domains/orders/getOrderTotalRefund'
import useApi from '@/composable/useApi'
import type { Money } from '@futureecom/futureecom-js'
import type { Order, OrderRefundRequest } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionRefund',

  components: { FormValidatorWrapper, OrderRefundInputs },

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
    const showRefundDialog = ref(false)

    const toBeRefunded = ref<OrderRefundRequest>()
    const totalRefund = ref<Money>()

    const refundHandler = async (): Promise<void> => {
      if (!toBeRefunded.value) {
        return
      }

      loading.value = true

      try {
        await api.orders.refundOrderItems(props.value.number, toBeRefunded.value)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Refunded successfully'))
      } catch {
        addErrorToast(t('Unable to refund'))
      } finally {
        showRefundDialog.value = false
        loading.value = false
      }
    }

    const hasRefundableAmount = computed(() => totalRefund.value?.amount || 0 !== 0)

    watch(
      toBeRefunded,
      () => {
        if (toBeRefunded.value) {
          totalRefund.value = getOrderTotalRefund(props.value, toBeRefunded.value)
        }
      },
      { deep: true, immediate: true }
    )

    return {
      hasRefundableAmount,
      totalRefund,
      toBeRefunded,
      showRefundDialog,
      loading,
      refundHandler
    }
  }
})
</script>
