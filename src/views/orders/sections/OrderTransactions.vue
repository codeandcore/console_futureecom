<template>
  <div class="d-flex flex-column">
    <h2>{{ $t('Payments') }}</h2>
    <div class="d-flex justify-space-between align-center">
      <order-payment-details :value="order" class="d-flex flex-column" />
    </div>

    <div class="d-flex flex-gap-16 mt-4">
      <order-action-refund v-if="showRefund" v-model="order" />
      <order-action-mark-as-paid v-if="showMarkAsPaid" v-model="order" />
      <order-action-void v-if="showVoid" v-model="order" />
      <order-action-capture-payment
        v-if="showCapture && authorizationTransaction"
        v-model="order"
        :transaction-id="authorizationTransaction.id"
      />
    </div>

    <div v-if="value.payment.type === 'online' && canVoid(order.status)" class="text-caption grey--text mt-4">
      <span>{{ $t('order.transaction.void') }}</span>
    </div>

    <v-divider class="my-4" />

    <h2>{{ $t('Payment Transactions') }}</h2>
    <v-data-table :items="order.transactions" :headers="headers" :items-per-page="-1" hide-default-footer>
      <template #item.provider="{ item }">
        <span class="d-block">{{ item.provider }}</span>
        <small>{{ item.id }}</small>
      </template>
      <template #item.amount="{ item }">
        <span>{{ $format.money.withStoreCurrency(item.amount) }}</span>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="getTransactionStatusColor(item.status)" label small text-color="white">
          {{ $t(getTransactionStatus(item.status)) }}
        </v-chip>
      </template>
      <template #item.created_at="{ item }">
        <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { canAny } from '@/composable/useCanChecker'
import {
  canCapture,
  canMarkAsPaid,
  canRefund,
  canVoid,
  hasTransactionPaymentCapturedOffline
} from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useTransactionStatus } from '@/composable/useTransactionStatus'
import OrderActionCapturePayment from '@/components/domains/orders/actions/OrderActionCapturePayment.vue'
import OrderActionMarkAsPaid from '@/components/domains/orders/actions/OrderActionMarkAsPaid.vue'
import OrderActionRefund from '@/components/domains/orders/actions/OrderActionRefund.vue'
import OrderActionVoid from '@/components/domains/orders/actions/OrderActionVoid.vue'
import OrderPaymentDetails from '@/components/domains/orders/OrderPaymentDetails.vue'
import type { Order, OrderTransaction } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderPaymentTransactions',

  components: {
    OrderActionCapturePayment,
    OrderPaymentDetails,
    OrderActionRefund,
    OrderActionMarkAsPaid,
    OrderActionVoid
  },

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const { getTransactionStatus, getTransactionStatusColor } = useTransactionStatus()

    const order = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const headers = computed(() => [
      { text: t('Provider'), value: 'provider' },
      { text: t('Type'), value: 'type' },
      { text: t('Payment type'), value: 'payment_type' },
      { text: t('Amount'), value: 'amount' },
      { text: t('Status'), value: 'status' },
      { text: t('Created At'), value: 'created_at', align: 'center' }
    ])

    const showMarkAsPaid = computed(() => {
      return canMarkAsPaid(props.value) && canAny(['manage,orders\\order', 'mark-as-paid,orders\\order']).value
    })

    const showRefund = computed((): boolean => {
      return canRefund(props.value) && canAny(['manage,orders\\order', 'refund,orders\\order']).value
    })

    const showVoid = computed((): boolean => {
      if (!canAny(['manage,orders\\order', 'void,orders\\order']).value) {
        return false
      }

      if (props.value.summary.total_paid.amount !== props.value.summary.total_due.amount) {
        return false
      }

      if (props.value.payment.type === 'offline') {
        return false
      }

      if (hasTransactionPaymentCapturedOffline(props.value)) {
        return false
      }

      return canVoid(props.value.status)
    })

    const authorizationTransaction = computed((): OrderTransaction | undefined => {
      return props.value.transactions.find((trans) => trans.type === 'authorize')
    })

    const showCapture = computed(() => {
      return canCapture(props.value) && canAny(['manage,payments\\authorize', 'update,payments\\authorize']).value
    })

    return {
      order,
      headers,
      showRefund,
      showMarkAsPaid,
      showVoid,
      showCapture,
      authorizationTransaction,
      getTransactionStatus,
      getTransactionStatusColor,
      canVoid
    }
  }
})
</script>
