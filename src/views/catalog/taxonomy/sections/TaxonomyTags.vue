<template>
  <selectable-tags
    v-model="taxonomy"
    :items="taxonomy.tags || undefined"
    :grid-options="tagOptions"
    show-chips
    multiple
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectableTags from '@/components/common/selectables/resources/SelectableTags.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyTags',

  components: {
    SelectableTags
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

    const tagOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [{ text: t('Name'), value: 'name', sortable: false }]
      return { headers }
    })

    return {
      taxonomy,
      tagOptions
    }
  }
})
</script>
