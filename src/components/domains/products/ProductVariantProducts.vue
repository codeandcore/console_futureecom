<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-gap-16">
      <span class="text-caption">
        {{ $t('Will propagate selected Attributes from Parent product to selected Variations.') }}
      </span>
      <product-action-variants-propagation
        :disabled="!showAttributesButton"
        :value="product"
        :items="selectedVariants"
      />
    </div>

    <v-data-table v-model="selectedVariants" :items="value" :headers="headers" show-select class="my-4">
      <template #item.image_url="{ item }">
        <image-zoom>
          <template #thumbnail>
            <product-image-preview :value="item.image_url" height="40" width="40" class="my-3 rounded-lg" />
          </template>
          <template #zoom>
            <product-image-preview :value="item.image_url" max-width="300" />
          </template>
        </image-zoom>
      </template>
      <template #item.sku="{ item }">
        <router-link :to="{ name: 'product-update', params: { id: item.id } }">
          {{ item.sku }}
        </router-link>
      </template>
      <template #item.real_price="{ item }">
        {{ $format.money.withStoreCurrency(item.real_price) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ImageZoom from '@/components/common/ImageZoom.vue'
import ProductActionVariantsPropagation from '@/components/domains/products/actions/ProductActionVariantsPropagation.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductVariantProducts',
  components: { ImageZoom, ProductImagePreview, ProductActionVariantsPropagation },
  props: {
    value: {
      type: Array as PropType<Product[]>,
      default: () => []
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup() {
    const { t } = useI18n()

    const selectedVariants = ref<Product[]>([])
    const showAttributesButton = computed(() => selectedVariants.value.length > 0)

    const headers = computed(() => {
      return [
        { text: t('Image'), value: 'image_url' },
        { text: t('SKU'), value: 'sku' },
        { text: t('Name'), value: 'name' },
        { text: t('Inventory'), value: 'inventory.quantity' },
        { text: t('Price'), value: 'real_price' },
        { text: '', value: null, sortable: false }
      ]
    })

    return {
      selectedVariants,
      showAttributesButton,
      headers
    }
  }
})
</script>
