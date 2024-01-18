<template>
  <div>
    <div class="d-flex flex-gap-16">
      <product-price v-model="tier" :vat="vat" :rules="rules.price" />
      <product-gross-price v-model="tier" :vat="vat" />
    </div>

    <product-tier-quantity v-model="tier" :rules="rules.quantity" />
    <product-tier-customer-groups v-model="tier" class="d-flex flex-column flex-gap-16" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ProductGrossPrice from '@/components/domains/products/inputs/ProductGrossPrice.vue'
import ProductPrice from '@/components/domains/products/inputs/ProductPrice.vue'
import ProductTierCustomerGroups from '@/components/domains/products/tiers/ProductTierCustomerGroups.vue'
import ProductTierQuantity from '@/components/domains/products/tiers/ProductTierQuantity.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductTierRules } from '@/types/catalog/product'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductTierInputs',

  components: { ProductPrice, ProductGrossPrice, ProductTierCustomerGroups, ProductTierQuantity },

  props: {
    value: {
      type: Object as PropType<ProductTier>,
      default: undefined
    },
    vat: {
      type: Object as PropType<BaseVat>,
      default: undefined
    },
    rules: {
      type: Object as PropType<ProductTierRules>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tier = computed({
      get: () => props.value,
      set: (tier) => {
        emit('input', tier)
      }
    })

    return {
      tier
    }
  }
})
</script>
