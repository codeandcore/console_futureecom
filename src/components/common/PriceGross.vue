<template>
  <money-amount-field
    v-bind="$attrs"
    :value="value"
    :disabled="disabled"
    :hide-details="disabled"
    @input="onGrossPriceChange"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { recalculateNet } from '@/libs/vatRecalcuations'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PriceGross',

  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<Money | null>,
      default: null
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: () => undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const onGrossPriceChange = (grossPrice: Money | null): void => {
      if (props.disabled) {
        return
      }

      const canRecalculate = props.vat && grossPrice && !props.disabled
      const netPrice = canRecalculate ? recalculateNet(grossPrice, props.vat) : grossPrice
      emit('change', { price: netPrice, gross_price: grossPrice })
    }

    return {
      onGrossPriceChange
    }
  }
})
</script>
