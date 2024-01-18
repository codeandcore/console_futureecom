<template>
  <expandable-content outlined>
    <template #title>
      <div class="d-flex justify-space-between align-center flex-grow-1">
        <span data-cy="selected-taxonomy">{{ $t('Taxonomy') }}: {{ (value.taxonomy || { name: '' }).name }}</span>
        <v-btn v-if="value.taxonomy_id" icon data-cy="remove-taxonomy" @click.stop="updateTaxonomy([])">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </template>
    <template #content>
      <v-divider />
      <selectable-taxonomy-tree :value="value.taxonomy ? [value.taxonomy] : []" return-object @input="updateTaxonomy" />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableTaxonomyTree from '@/components/common/selectables/SelectableTaxonomyTree.vue'
import type { Product, Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductTaxonomyId',
  components: { SelectableTaxonomyTree, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const updateTaxonomy = (val: Taxonomy[]) => {
      const data = {
        taxonomy: val[0] || null,
        taxonomy_id: val[0]?.id || null
      }
      emit('input', { ...props.value, ...data })
    }

    return {
      updateTaxonomy
    }
  }
})
</script>
