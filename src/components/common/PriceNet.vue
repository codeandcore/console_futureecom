<template>
  <money-amount-field
    v-bind="$attrs"
    :value="value"
    :disabled="disabled"
    :hide-details="disabled"
    @input="onPriceChange"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { recalculateGross } from '@/libs/vatRecalcuations'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PriceNet',

  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<Money | null>,
      default: null
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const onPriceChange = (price: Money | null): void => {
      if (props.disabled) {
        return
      }
      const canRecalculate = props.vat && price && !props.disabled
      const grossPrice = canRecalculate ? recalculateGross(price, props.vat) : price
      emit('change', { price, gross_price: grossPrice })
    }

    return {
      onPriceChange
    }
  }
})
</script>
