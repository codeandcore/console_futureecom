<template>
  <selectable-products
    v-model="taxonomy"
    :items="taxonomy.products || undefined"
    :grid-options="productOptions"
    show-chips
    multiple
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyProducts',

  components: {
    SelectableProducts
  },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const taxonomy = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
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
      taxonomy,
      productOptions
    }
  }
})
</script>
