<template>
  <div class="d-flex flex-column">
    <product-classification v-model="product" :disabled="!!value.id" data-cy="classification" />
    <product-sku v-model="product" data-cy="product-type" />
    <product-sort-order v-model="product" data-cy="product-sort-order" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ProductClassification from '@/components/domains/products/inputs/ProductClassification.vue'
import ProductSku from '@/components/domains/products/inputs/ProductType.vue'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductSettings',
  components: { ProductSortOrder: SortOrderInput, ProductSku, ProductClassification },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (val: Product) => emit('input', val)
    })

    return {
      product
    }
  }
})
</script>
