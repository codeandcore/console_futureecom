<template>
  <switch-field v-bind="$attrs" v-model="paidToAccount" :label="$t('Paid to account')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PaymentBankTransfer } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BankTransferPaidToAccount',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<PaymentBankTransfer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const paidToAccount = computed({
      get: () => props.value.paid_to_account,
      set: (paid_to_account) => emit('input', { ...props.value, paid_to_account })
    })

    return {
      paidToAccount
    }
  }
})
</script>
