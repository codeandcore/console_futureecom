<template>
  <price-net
    v-bind="$attrs"
    :key="key"
    :value="price"
    :vat="vat"
    :disabled="netDisabled"
    :label="$t('Price')"
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
  name: 'ProductPrice',

  components: { PriceNet },

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
    const { netDisabled } = useTaxes()

    const price = computed(() => props.value.price)
    const onPricesChange = (netGross: NetGrossValue) => emit('input', { ...props.value, ...netGross })
    const key = computed(() => (netDisabled.value && price.value ? `${price.value.amount}` : ''))

    return {
      price,
      onPricesChange,
      netDisabled,
      key
    }
  }
})
</script>
