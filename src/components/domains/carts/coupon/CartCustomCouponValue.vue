<template>
  <money-amount-field
    v-if="isDistributedRateType"
    v-model="moneyValue"
    v-bind="$attrs"
    :label="$t('Rate')"
    :prefix="storeCurrencySymbol"
  />

  <v-text-field
    v-else
    v-bind="$attrs"
    v-model.number="percentageValue"
    outlined
    hide-details="auto"
    type="number"
    prefix="%"
    :label="$t('Rate')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCurrency } from '@/composable/repositories/useCurrency'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { Money } from '@futureecom/futureecom-js'
import type { OrderableCustomDiscount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCustomCouponValue',

  components: {
    MoneyAmountField
  },

  props: {
    value: {
      type: Object as PropType<OrderableCustomDiscount>,
      default: undefined
    },
  },

  setup(props, { emit }) {
    const { storeCurrencySymbol } = useCurrency()
    const isDistributedRateType = computed(() => props.value.rate_type === 'distributed')

    const percentageValue = computed({
      get: (): string | number | Money => props.value.value,
      set: (value) => emit('input', { ...props.value, value })
    })

    const moneyValue = computed({
      get: (): Money | null => {
        if (!props.value.value) {
          return null
        }
        return {
          amount: props.value.value,
          currency: ''
        }
      },
      set: (value: Money | null) => 
        emit('input', { ...props.value, value: value ? Number(value.amount) : value })
    })

    return {
      moneyValue,
      percentageValue,
      storeCurrencySymbol,
      isDistributedRateType
    }
  }
})
</script>
