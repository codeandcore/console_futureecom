<template>
  <div>
    <payment-method-provider-test-mode v-model="payment" />
    <payment-method-provider-auto-pay v-model="payment" />
    <bank-transfer-paid-to-account v-model="payment" />
    <bank-transfer-account-number v-model="payment" class="required" :error-messages="errors['account_number']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import BankTransferAccountNumber from '@/components/domains/payments/providers/BankTransfer/BankTransferAccountNumber.vue'
import BankTransferPaidToAccount from '@/components/domains/payments/providers/BankTransfer/BankTransferPaidToAccount.vue'
import PaymentMethodProviderAutoPay from '@/components/domains/payments/providers/common/PaymentMethodProviderAutoPay.vue'
import PaymentMethodProviderTestMode from '@/components/domains/payments/providers/common/PaymentMethodProviderTestMode.vue'
import type { PaymentBankTransfer } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentBankTransferInputs',

  components: {
    PaymentMethodProviderAutoPay,
    PaymentMethodProviderTestMode,
    BankTransferAccountNumber,
    BankTransferPaidToAccount
  },

  props: {
    value: {
      type: Object as PropType<PaymentBankTransfer>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const payment = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      payment
    }
  }
})
</script>
