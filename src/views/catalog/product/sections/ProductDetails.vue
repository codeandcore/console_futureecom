<template>
  <div class="d-flex flex-column flex-gap-16">
    <translation-tabs :translatable-values="translatableValues">
      <template #default.name>
        <product-name v-model="product" class="required" :rules="validator.rules.name" />
      </template>
      <template #name="{ code }">
        <product-name v-model="product" class="required" :translation-code="code" />
      </template>
    </translation-tabs>

    <product-taxonomy-id v-model="product" />
    <product-slug v-model="product" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import ProductTaxonomyId from '@/components/domains/products/ProductTaxonomyId.vue'
import SlugInput from '@/components/foundation/SlugInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductValidator } from '@/composable/resources/useProduct'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDetails',
  components: {
    ProductName: NameInput,
    ProductTaxonomyId,
    ProductSlug: SlugInput,
    TranslationTabs
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
    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    return {
      product,
      translatableValues: ['name', 'tags']
    }
  }
})
</script>
