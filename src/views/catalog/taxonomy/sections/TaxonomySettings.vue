<template>
  <div class="d-flex flex-column flex-gap-16">
    <taxonomy-sort-order v-model="taxonomy" />
    <taxonomy-image v-model="taxonomy" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomySettings',
  components: { TaxonomyImage: ImageUrlInput, TaxonomySortOrder: SortOrderInput },
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
