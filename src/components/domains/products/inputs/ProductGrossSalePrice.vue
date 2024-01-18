<template>
  <price-gross
    v-bind="$attrs"
    :key="key"
    :value="grossSalePrice"
    :vat="vat"
    :disabled="grossDisabled"
    :label="$t('Gross Sale Price')"
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
  name: 'ProductGrossSalePrice',

  components: { PriceGross },

  props: {
    value: {
      type: Object as PropType<{ [key: string]: any; gross_sale_price: Money | null }>,
      required: true
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { grossDisabled } = useTaxes()

    const grossSalePrice = computed(() => props.value.gross_sale_price)
    const onGrossPricesChange = (netGross: NetGrossValue) => {
      const { price: sale_price, gross_price: gross_sale_price } = netGross
      emit('input', { ...props.value, sale_price, gross_sale_price })
    }

    const key = computed(() => (grossDisabled.value && grossSalePrice.value ? `${grossSalePrice.value.amount}` : ''))

    return {
      grossSalePrice,
      onGrossPricesChange,
      grossDisabled,
      key
    }
  }
})
</script>
