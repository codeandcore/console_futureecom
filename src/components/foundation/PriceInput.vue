<template>
  <money-amount-field
    v-bind="$attrs"
    :key="netDisabled.value && price.value ? `price-${price.value.amount}` : 'price'"
    :value="price"
    :disabled="netDisabled"
    :hide-details="netDisabled"
    :label="$t('Price')"
    @input="onPriceChange"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { recalculateGross } from '@/libs/vatRecalcuations'
import { useTaxes } from '@/composable/useTaxes'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PriceInput',

  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; price?: Money | null; gross_price?: Money | null }>,
      required: true
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { netDisabled } = useTaxes()

    const price = computed(() => props.value.price)

    const onPriceChange = (value: Money | null): void => {
      if (netDisabled.value) {
        return
      }
      const canRecalculate = props.vat && value && !netDisabled.value
      const recalculated = canRecalculate ? recalculateGross(value, props.vat) : value
      emit('input', { ...props.value, price: value, gross_price: recalculated })
    }

    return {
      price,
      onPriceChange,
      netDisabled
    }
  }
})
</script>
