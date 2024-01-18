<template>
  <div class="d-flex align-start">
    <product-image-preview :value="value.image_url" :max-width="imageSize" :max-height="imageSize" contain />
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex flex-column mx-3">
        <router-link
          :is="canRead || canUpdate || canDelete ? 'router-link' : 'span'"
          :to="{ name: 'product-update', params: { id: productId } }"
        >
          {{ value.name }}
        </router-link>
        <span class="text-caption grey--text">{{ value.sku }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import type { OrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewItemOverview',

  components: { ProductImagePreview },

  props: {
    value: {
      type: Object as PropType<Partial<Pick<OrderableItem, 'image_url' | 'name' | 'sku'>>>,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    imageSize: {
      type: Number,
      default: 50
    }
  },

  setup() {
    const { canRead, canUpdate, canDelete } = useCrudChecker('catalog\\product')

    return {
      canRead,
      canUpdate,
      canDelete
    }
  }
})
</script>
