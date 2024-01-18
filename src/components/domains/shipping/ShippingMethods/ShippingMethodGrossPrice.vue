<template>
  <price-gross
    v-bind="$attrs"
    :key="key"
    :value="grossPrice"
    :vat="vat"
    :disabled="grossDisabled"
    :label="$t('Gross Price')"
    @change="onGrossPricesChange"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useTaxes } from '@/composable/useTaxes'
import PriceGross from '@/components/common/PriceGross.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { NetGrossValue } from '@/types/catalog/product'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ShippingMethodGrossPrice',

  components: { PriceGross },

  props: {
    value: {
      type: Object as PropType<{ [key: string]: any; price: Money | null; gross_price: Money | null }>,
      required: true
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { grossDisabled } = useTaxes()

    const grossPrice = computed(() => props.value.gross_price)
    const onGrossPricesChange = (netGross: NetGrossValue) => emit('input', { ...props.value, ...netGross })
    const key = computed(() => (grossDisabled.value && grossPrice.value ? `${grossPrice.value.amount}` : ''))

    return {
      grossPrice,
      onGrossPricesChange,
      grossDisabled,
      key
    }
  }
})
</script>
