<template>
  <v-text-field v-bind="$attrs" v-model="accountNumber" :label="$t('Account number')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentBankTransfer } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BankTransferAccountNumber',

  props: {
    value: {
      type: Object as PropType<PaymentBankTransfer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const accountNumber = computed({
      get: () => props.value.account_number,
      set: (account_number) => emit('input', { ...props.value, account_number })
    })

    return {
      accountNumber
    }
  }
})
</script>
