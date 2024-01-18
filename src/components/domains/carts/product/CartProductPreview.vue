<template>
  <div class="d-flex flex-column">
    <product-image-preview :value="value.image_url" height="300" width="300" class="my-3 rounded-lg" />

    <span class="my-4 text-body-1">{{ $t('Availability') }}</span>
    <span class="my-2 d-flex">
      {{ $t('Per order') }}:
      {{ value.inventory.min_per_order || '1' }}
      <v-icon mx-3>arrow_right_alt</v-icon>
      <v-icon v-if="!value.inventory.max_per_order" class="mx-1">all_inclusive</v-icon>
      <span v-else>{{ value.inventory.max_per_order }}</span>
    </span>
    <span v-if="value.classification !== 'bundle'" class="my-2">
      {{ $t('In Stock') }}: {{ value.inventory.quantity }}
    </span>
    <span>{{ $t('Policy') }}: {{ $t(value.inventory.policy || '') }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartProductInventoryPreview',
  components: { ProductImagePreview },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  }
})
</script>
