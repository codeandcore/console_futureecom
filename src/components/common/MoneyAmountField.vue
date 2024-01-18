<template>
  <v-text-field
    v-maska
    :data-maska="mask"
    data-maska-tokens="0:\d:multiple|9:\d:optional"
    :value="amount"
    v-bind="$attrs"
    outlined
    :prefix="storeCurrencySymbol"
    hide-details="auto"
    @input="setAmount"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCurrency } from '@/composable/repositories/useCurrency'
import { useMoney } from '@/composable/useMoney'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MoneyAmountField',

  props: {
    value: {
      type: Object as PropType<Money | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { storeCurrency, storeCurrencySymbol } = useCurrency()
    const { fromMoneyAmount, toMoney, getCurrencyDecimalPoint } = useMoney()

    const currentCurrency = props.value?.currency || storeCurrency.value
    const amount = computed(() => (props.value && props.value.amount !== '' ? fromMoneyAmount(props.value.amount) : ''))

    const setAmount = (value: string) => {
      try {
        emit('input', value !== '' ? toMoney(value, currentCurrency) : null)
      } catch (e) {
        return
      }
    }

    const mask = computed(() => {
      return `0.${'9'.repeat(getCurrencyDecimalPoint(currentCurrency))}`
    })

    return {
      storeCurrencySymbol,
      amount,
      setAmount,
      mask
    }
  }
})
</script>
