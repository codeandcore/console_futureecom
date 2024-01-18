<template>
  <selectable-taxonomies
    :items="value.children"
    :grid-options="taxonomyOptions"
    :request-options="{ filter: { id: { neq: value.id } } }"
    multiple
    show-chips
    @input="onInput"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectableTaxonomies from '@/components/common/selectables/resources/SelectableTaxonomies.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyChildren',

  components: { SelectableTaxonomies },

  props: {
    value: {
      type: Object as PropType<{ children: Taxonomy['children']; propagate_to: string[] }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const onInput = (children_ids: string[]) => {
      const propagate_to = (props.value.propagate_to || []).filter((id) => children_ids.includes(id))
      emit('input', { ...props.value, children_ids, propagate_to })
    }

    const taxonomyOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    return {
      taxonomyOptions,
      onInput
    }
  }
})
</script>
