<template>
  <product-associated-categories v-model="product" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ProductAssociatedCategories from '@/components/domains/products/inputs/ProductAssociatedCategories.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductCategories',

  components: { ProductAssociatedCategories },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    return {
      product
    }
  }
})
</script>
