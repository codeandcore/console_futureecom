<template>
  <v-autocomplete
    v-model="parent"
    :search-input.sync="parentSearch"
    :label="$t('Parent taxonomy')"
    outlined
    cache-items
    hide-details="auto"
    :items="selectParentItems"
    :loading="loading"
    item-text="name"
    return-object
    clearable
    :disabled="!canRead"
  >
    <template #append-outer>
      <no-permissions-tooltip v-if="!canRead" />
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import NoPermissionsTooltip from '@/components/common/NoPermissionsTooltip.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyParent',

  components: { NoPermissionsTooltip },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const parentSearch = ref('')

    const parent = computed({
      get: () => props.value.parent,
      set: (parent: Taxonomy | null | undefined) => emit('input', { ...props.value, parent_id: parent?.id })
    })

    const parentTaxonomy = collectionLoader()
    const selectParentItems = computed(() => {
      return parentTaxonomy.data.value.filter((parent: Taxonomy) => parent.id !== props.value.id)
    })

    debouncedWatch(
      parentSearch,
      (name: string) => {
        if (name === parent.value?.name) {
          return
        }
        const filter = name ? { name } : undefined
        parentTaxonomy.loadCollection(() => api.catalog.taxonomies({ perPage: 5, filter }))
      },
      { debounce: 700 }
    )

    return {
      parent,
      parentSearch,
      selectParentItems,
      loading: parentTaxonomy.loading,
      canRead: root.$canAny('manage,catalog\\taxonomy', 'read,catalog\\taxonomy')
    }
  }
})
</script>
