<template>
  <div class="d-flex flex-column flex-gap-16">
    <product-image-url v-model="image" value-key="url" :label="$t('Image URL')" :error-message="errors['url']" />
    <product-image-sort-order v-model="image" :error-message="errors['order']" />
    <product-image-alt v-model="image" :error-message="errors['alt']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import ProductImageAlt from '@/components/domains/products/images/ProductImageAlt.vue'
import SortOrder from '@/components/foundation/SortOrderInput.vue'
import type { ProductImage } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'ProductImageInputs',

  components: { ProductImageAlt, ProductImageSortOrder: SortOrder, ProductImageUrl: ImageUrlInput },

  props: {
    value: {
      type: Object as PropType<ProductImage>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const image = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      image
    }
  }
})
</script>
