<template>
  <expandable-content outlined>
    <template #title>
      <span>
        {{ $t('Linked products') }} {{ (category.product_ids || []).length ? `(${category.product_ids.length})` : '' }}
      </span>
    </template>
    <template #content>
      <v-divider />
      <selectable-products
        v-model="category"
        :items="category.products || undefined"
        :grid-options="productOptions"
        show-chips
        multiple
        class="ma-4"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CategoryProductIds',

  components: { ExpandableContent, SelectableProducts },

  props: {
    value: {
      type: Object as PropType<Partial<Category>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const category = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
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

    return {
      productOptions,
      category
    }
  }
})
</script>
