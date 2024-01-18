<template>
  <expandable-content>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Linked taxonomy')" :items="value.taxonomy_ids" />
    </template>
    <template #content>
      <v-divider />
      <selectable-taxonomies
        v-model="tag"
        :items="tag.taxonomies || undefined"
        :grid-options="taxonomyOptions"
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
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import SelectableTaxonomies from '@/components/common/selectables/resources/SelectableTaxonomies.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'TagTaxonomyIds',

  components: {
    SelectableResourceHeader,
    SelectableTaxonomies,
    ExpandableContent
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
      set: (valu) => emit('input', valu)
    })

    const taxonomyOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [{ text: t('Name'), value: 'name' }]
      return { headers }
    })

    const chipErrors = computed(() => getChipErrors('taxonomy_ids', props.errors))

    return {
      tag,
      taxonomyOptions,
      chipErrors
    }
  }
})
</script>
