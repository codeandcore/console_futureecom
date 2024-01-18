<template>
  <div class="d-flex flex-column flex-gap-16">
    <product-avalara-tax-code v-if="isPluginEnabled('avalara').value" v-model="product" />

    <product-vat v-model="product" />

    <div :key="`price-${vatKey}`" class="d-flex flex-gap-16">
      <product-price
        v-model="product"
        :vat="product.vat"
        :rules="netDisabled ? [] : validator.rules.price"
        :class="{ required: grossDisabled }"
      />
      <product-gross-price
        v-model="product"
        :vat="product.vat"
        :rules="grossDisabled ? [] : validator.rules.gross_price"
        :class="{ required: netDisabled }"
      />
    </div>
    <div :key="`sale-price-${vatKey}`" class="d-flex flex-gap-16">
      <product-sale-price v-model="product" :vat="product.vat" />
      <product-gross-sale-price v-model="product" :vat="product.vat" />
    </div>

    <v-divider class="my-8" />

    <product-tiers
      :key="product.updated_at"
      v-model="product"
      :vat="product.vat"
      class="d-flex flex-column flex-gap-16"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useTaxes } from '@/composable/useTaxes'
import AvalaraTaxCode from '@/components/common/AvalaraTaxCode.vue'
import ProductGrossPrice from '@/components/domains/products/inputs/ProductGrossPrice.vue'
import ProductGrossSalePrice from '@/components/domains/products/inputs/ProductGrossSalePrice.vue'
import ProductPrice from '@/components/domains/products/inputs/ProductPrice.vue'
import ProductSalePrice from '@/components/domains/products/inputs/ProductSalePrice.vue'
import ProductTiers from '@/components/domains/products/ProductTiers.vue'
import ProductVat from '@/components/domains/products/inputs/ProductVat.vue'
import isPluginEnabled from '@/composable/isPluginEnabled'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductValidator } from '@/composable/resources/useProduct'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductPricing',

  components: {
    ProductAvalaraTaxCode: AvalaraTaxCode,
    ProductGrossSalePrice,
    ProductGrossPrice,
    ProductPrice,
    ProductSalePrice,
    ProductTiers,
    ProductVat
  },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    },
    validator: {
      type: Object as PropType<ProductValidator>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { netDisabled, grossDisabled } = useTaxes()

    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    const vatKey = computed(() => (props.value.vat ? props.value.vat.value : ''))

    return {
      isPluginEnabled,
      netDisabled,
      grossDisabled,
      product,
      vatKey
    }
  }
})
</script>
