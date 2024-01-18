<template>
  <div class="d-flex flex-column flex-gap-16">
    <image-url-input v-model="product" :label="$t('Default Image')" />
    <v-divider class="my-4" />
    <product-images-input v-model="product" class="mx-6" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import ProductImagesInput from '@/components/domains/products/inputs/ProductImagesInput.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductImages',

  components: { ProductImagesInput, ImageUrlInput },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      product
    }
  }
})
</script>
