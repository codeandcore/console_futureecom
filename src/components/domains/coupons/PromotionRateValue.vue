<template>
  <v-text-field
    v-if="isPercentageRateType"
    v-bind="$attrs"
    v-model.number="percentageValue"
    prefix="%"
    :label="$t('Rate')"
    outlined
    hide-details="auto"
    type="number"
  />
  <money-amount-field
    v-else
    v-bind="$attrs"
    v-model="moneyValue"
    :label="$t('Rate')"
    :prefix="storeCurrencySymbol"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCurrency } from '@/composable/repositories/useCurrency'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { Money } from '@futureecom/futureecom-js'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionRateValue',
  components: { MoneyAmountField },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { storeCurrencySymbol } = useCurrency()
    const isPercentageRateType = computed(() => props.value.rate_type === 'percentage')

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
      set: (value: Money | null) => emit('input', { ...props.value, value: value ? value.amount : value })
    })

    return {
      percentageValue,
      moneyValue,
      isPercentageRateType,
      storeCurrencySymbol
    }
  }
})
</script>
