<template>
  <div>
    <product-image-preview :value="value.image_url" :height="imageSize" :width="imageSize" class="my-3 rounded-lg" />
    <div class="d-flex flex-column">
      <div class="d-flex flex-column mx-3">
        <router-link
          :is="canRead || canUpdate || canDelete ? 'router-link' : 'span'"
          :to="{ name: 'product-update', params: { id: value.product_id } }"
        >
          {{ value.name }}
        </router-link>

        <span class="text-caption grey--text">{{ value.sku }}</span>

        <div v-if="value.classification === 'bundle'">
          <div v-for="bundleItem in value.components" :key="bundleItem.id" class="text-caption">
            {{ bundleItem.quantity }}x

            <router-link
              :is="canAccessProduct ? 'router-link' : 'span'"
              :to="{ name: 'product-update', params: { id: bundleItem.id } }"
            >
              {{ value.name }}
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="hasOrderItemExtras(value) || hasOrderItemNotes(value)" class="mt-2 text-caption mx-3">
        <orderable-preview-item-extras v-if="hasOrderItemExtras(value)" class="d-flex flex-column" :value="value" />
        <div v-if="hasOrderItemNotes(value)" class="d-flex flex-column">
          <span>{{ $t('Notes') }}:</span>
          <orderable-preview-item-note :value="value.notes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import OrderablePreviewItemExtras from '@/components/domains/carts/preview/items/OrderablePreviewItemExtras.vue'
import OrderablePreviewItemNote from '@/components/domains/carts/preview/items/OrderablePreviewItemNote.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import type { OrderItem } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderItemPreview',

  components: { ProductImagePreview, OrderablePreviewItemExtras, OrderablePreviewItemNote },

  props: {
    value: {
      type: Object as PropType<OrderItem>,
      required: true
    },
    imageSize: {
      type: Number,
      default: 50
    }
  },

  setup() {
    const { canRead, canUpdate, canDelete } = useCrudChecker('catalog\\product')

    const hasOrderItemNotes = (item: OrderItem): boolean => {
      if (Array.isArray(item.notes) && item.notes.length) {
        return true
      }
      return typeof item.notes === 'object' && Object.keys(item.notes).length > 0
    }

    const hasOrderItemExtras = (item: OrderItem): boolean => (item.extras || []).length > 0

    return {
      canRead,
      canUpdate,
      canDelete,
      hasOrderItemNotes,
      hasOrderItemExtras
    }
  }
})
</script>
