<template>
  <expandable-content>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Linked products')" :items="value.product_ids" />
    </template>
    <template #content>
      <v-divider />
      <selectable-products
        v-model="tag"
        :items="tag.products || undefined"
        :grid-options="productOptions"
        show-chips
        multiple
        class="ma-4"
        :errors="chipErrors"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'TagProductIds',

  components: {
    SelectableResourceHeader,
    ExpandableContent,
    SelectableProducts
  },

  props: {
    value: {
      type: Object as PropType<Partial<Tag>>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const tag = computed({
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

    const chipErrors = computed(() => getChipErrors('product_ids', props.errors))

    return {
      tag,
      productOptions,
      chipErrors
    }
  }
})
</script>
