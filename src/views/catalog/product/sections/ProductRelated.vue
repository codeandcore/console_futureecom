<template>
  <div class="d-flex flex-column flex-gap-16">
    <expandable-content outlined>
      <template #title>
        <span>
          {{ $t('Products') }}
          {{ (products.product_ids || []).length ? `(${products.product_ids.length})` : '' }}
        </span>
      </template>
      <template #content>
        <v-divider />
        <selectable-products v-model="products" :grid-options="productOptions" show-chips multiple class="ma-4" />
      </template>
    </expandable-content>
    <expandable-content outlined>
      <template #title>
        <span>
          {{ $t('Categories') }}
          {{ (categories.category_ids || []).length ? `(${categories.category_ids.length})` : '' }}
        </span>
      </template>
      <template #content>
        <v-divider />
        <selectable-categories v-model="categories" :grid-options="categoryOptions" show-chips multiple class="ma-4" />
      </template>
    </expandable-content>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ProductRelated',

  components: {
    SelectableCategories,
    SelectableProducts,
    ExpandableContent
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const products = computed({
      get: () => ({ product_ids: props.value.related?.products }),
      set: (val) => {
        const toEmit = { ...props.value, related: { ...props.value.related, products: val.product_ids || [] } }
        emit('input', toEmit)
      }
    })

    const categories = computed({
      get: () => ({ category_ids: props.value.related?.categories }),
      set: (val) => {
        const toEmit = { ...props.value, related: { ...props.value.related, categories: val.category_ids || [] } }
        emit('input', toEmit)
      }
    })

    const productOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Image'), value: 'image_url', sortable: false },
        { text: t('Name'), value: 'name' },
        { text: t('SKU'), value: 'sku' },
        { text: t('Classification'), value: 'classification' }
      ]

      return { headers }
    })

    const categoryOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    return {
      products,
      categories,
      productOptions,
      categoryOptions
    }
  }
})
</script>
