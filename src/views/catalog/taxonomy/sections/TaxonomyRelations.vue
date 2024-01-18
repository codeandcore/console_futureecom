<template>
  <div class="d-flex flex-column flex-gap-16">
    <taxonomy-parent v-model="taxonomy" />
    <div>
      <span class="my-4 body d-block grey--text text--darken-2">{{ $t('Children taxonomies') }}</span>
      <taxonomy-children v-model="taxonomy" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TaxonomyChildren from '@/components/domains/taxonomy/TaxonomyChildren.vue'
import TaxonomyParent from '@/components/domains/taxonomy/TaxonomyParent.vue'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyRelations',
  components: {
    TaxonomyChildren,
    TaxonomyParent
  },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { emit }) {
    const taxonomy = computed({
      get: (): Taxonomy => props.value,
      set: (val: Taxonomy) => emit('input', val)
    })

    return {
      taxonomy
    }
  }
})
</script>
