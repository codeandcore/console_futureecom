<template>
  <expandable-content outlined>
    <template #title>
      <div class="d-flex justify-space-between align-center flex-grow-1">
        <div>
          <span>{{ $t('Taxonomy') }}</span>
          <span v-if="currentItem && currentItem.name">: {{ currentItem.name }}</span>
        </div>
        <v-btn v-if="currentItem" multiple-active icon @click.stop="currentItem = undefined">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </template>
    <template #content>
      <v-divider />
      <div v-if="loading" class="d-flex justify-center my-4">
        <v-progress-circular size="32" color="primary" indeterminate />
      </div>

      <v-treeview
        v-else
        data-cy="selectable-taxonomy-tree"
        :value="[currentItem]"
        v-bind="$attrs"
        activatable
        hoverable
        :items="taxonomy"
        return-object
        role="button"
        @update:active="onSelect"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'SelectTaxonomy',

  components: { ExpandableContent },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(true)
    const taxonomy = ref<Taxonomy[]>([])

    const currentItem = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    api.catalog
      .taxonomies({ perPage: -1, include: ['children'] })
      .then((val) => (taxonomy.value = val.data))
      .catch(() => addErrorToast(t('Unable to fetch taxonomies')))
      .finally(() => (loading.value = false))

    const onSelect = (val: Taxonomy[]) => emit('input', val[0])

    return {
      loading,
      taxonomy,
      currentItem,
      onSelect
    }
  }
})
</script>
