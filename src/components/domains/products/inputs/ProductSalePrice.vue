<template>
  <price-net
    v-bind="$attrs"
    :key="key"
    :value="salePrice"
    :vat="vat"
    :disabled="netDisabled"
    :label="$t('Sale Price')"
    @change="onPricesChange"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useTaxes } from '@/composable/useTaxes'
import PriceNet from '@/components/common/PriceNet.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { NetGrossValue } from '@/types/catalog/product'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductSalePrice',

  components: { PriceNet },

  props: {
    value: {
      type: Object as PropType<{ [key: string]: any; sale_price: Money | null }>,
      required: true
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { netDisabled } = useTaxes()

    const salePrice = computed(() => props.value.sale_price)
    const onPricesChange = (netGross: NetGrossValue) => {
      const { price: sale_price, gross_price: gross_sale_price } = netGross
      emit('input', { ...props.value, sale_price, gross_sale_price })
    }

    const key = computed(() => (netDisabled.value && salePrice.value ? `${salePrice.value.amount}` : ''))

    return {
      salePrice,
      onPricesChange,
      netDisabled,
      key
    }
  }
})
</script>
