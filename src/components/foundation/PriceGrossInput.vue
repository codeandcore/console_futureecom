<template>
  <money-amount-field
    v-bind="$attrs"
    :key="grossDisabled.value && priceGross.value ? `price-gross-${priceGross.value.amount}` : 'price-gross'"
    :value="priceGross"
    :disabled="grossDisabled"
    :hide-details="grossDisabled"
    :label="$t('Gross Price')"
    @input="onPriceGrossChange"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { recalculateNet } from '@/libs/vatRecalcuations'
import { useTaxes } from '@/composable/useTaxes'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PriceGrossInput',

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
    const { grossDisabled } = useTaxes()

    const priceGross = computed(() => props.value.gross_price)

    const onPriceGrossChange = (value: Money | null): void => {
      if (grossDisabled.value) {
        return
      }
      const canRecalculate = props.vat && value && !grossDisabled.value
      const recalculated = canRecalculate ? recalculateNet(value, props.vat) : value
      emit('input', { ...props.value, price: recalculated, gross_price: value })
    }

    return {
      priceGross,
      onPriceGrossChange,
      grossDisabled
    }
  }
})
</script>
