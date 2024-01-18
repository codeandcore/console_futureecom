<template>
  <v-text-field
    v-if="value.type === 'percent'"
    v-bind="$attrs"
    v-model.number="percentageAmount"
    :label="$t('Amount')"
    prefix="%"
    outlined
    type="number"
  />
  <money-amount-field v-else v-bind="$attrs" v-model="moneyAmount" :label="$t('Amount')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoFeeAmount',
  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings['fee']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const percentageAmount = computed({
      get: (): string | number | Money => props.value.amount,
      set: (amount) => emit('input', { ...props.value, amount })
    })

    const moneyAmount = computed({
      get: (): Money | null => (props.value.amount === '' ? null : { currency: '', amount: props.value.amount }),
      set: (value: Money | null) => emit('input', { ...props.value, amount: value?.amount || '' })
    })

    return {
      percentageAmount,
      moneyAmount
    }
  }
})
</script>
