<template>
  <div>
    <span>
      {{ $t('Payment from') }}:
      <router-link
        v-if="value.customer.customer_id"
        :to="{
          name: 'customer-update',
          params: { id: value.customer.customer_id }
        }"
      >
        {{ customerFullName }}
      </router-link>
      <span v-else>{{ customerFullName }}</span>
    </span>

    <span v-if="amountPaid">
      <span class="font-weight-bold">
        {{ $format.money.withStoreCurrency(amountPaid) }}
      </span>
      {{ $t('via') }}
      <span>
        {{ value.payment.name }}
        <span v-if="value.payment.type === 'online'" class="font-weight-bold">{{ $t('(online)') }}</span>
      </span>
    </span>

    <span v-if="value.payment.type === 'online'">
      {{ $t('Status') }}:
      <span class="font-weight-bold">{{ paymentStatus }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import {
  getTransactionTypeAmount,
  hasPaymentCaptured,
  hasTransactionType
} from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import type { Money } from '@futureecom/futureecom-js'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

type PaymentStatus = 'authorized' | 'partially refunded' | 'refunded' | 'captured'

export default defineComponent({
  name: 'OrderTransactionDetails',
  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  },

  setup(props) {
    const customerFullName = computed(() => {
      return `${props.value.customer.firstname} ${props.value.customer.lastname}`
    })

    const amountPaid = computed((): Money | undefined => {
      if (hasTransactionType(props.value, 'payment')) {
        return getTransactionTypeAmount(props.value, 'payment')
      }

      if (hasTransactionType(props.value, 'authorize')) {
        return getTransactionTypeAmount(props.value, 'authorize')
      }

      return undefined
    })

    const paymentStatus = computed((): PaymentStatus => {
      if (!hasTransactionType(props.value, 'payment') && hasTransactionType(props.value, 'authorize')) {
        return 'authorized'
      }

      if (
        hasTransactionType(props.value, 'authorize') &&
        hasTransactionType(props.value, 'payment') &&
        !hasTransactionType(props.value, 'refund') &&
        hasPaymentTransactionCaptured.value
      ) {
        return 'captured'
      }

      if (hasTransactionType(props.value, 'refund') && ['refunded', 'canceled'].includes(props.value.status)) {
        return 'refunded'
      }

      if (hasTransactionType(props.value, 'refund') && props.value.status !== 'refunded') {
        return 'partially refunded'
      }

      return 'authorized'
    })

    const hasPaymentTransactionCaptured = computed(() => hasPaymentCaptured(props.value))

    return {
      customerFullName,
      amountPaid,
      paymentStatus
    }
  }
})
</script>
