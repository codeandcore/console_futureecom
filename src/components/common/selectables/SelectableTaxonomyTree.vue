<template>
  <div v-if="loading" class="d-flex justify-center my-4">
    <v-progress-circular size="32" color="primary" indeterminate />
  </div>

  <v-treeview
    v-else
    data-cy="selectable-taxonomy-tree"
    :value="value"
    v-bind="$attrs"
    activatable
    :hoverable="true"
    :items="taxonomy"
    role="button"
    @update:active="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

/** @deprecated use SelectableTaxonomies.vue instead. In the Vuetify 3.0 VTreeview component is in Lab status **/
export default defineComponent({
  name: 'SelectableTaxonomyTree',

  inheritAttrs: false,
  props: {
    value: {
      type: Array as () => Taxonomy[],
      default: () => []
    }
  },

  setup() {
    const api = useApi()
    const taxonomy = collectionLoader()

    taxonomy.loadCollection(() => api.catalog.taxonomies({ perPage: -1, include: ['children'] }))

    return {
      taxonomy: taxonomy.data,
      loading: taxonomy.loading
    }
  }
})
</script>
