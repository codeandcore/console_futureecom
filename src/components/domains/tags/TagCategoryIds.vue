<template>
  <expandable-content>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Linked categories')" :items="value.category_ids" />
    </template>
    <template #content>
      <v-divider />
      <selectable-categories
        v-model="tag"
        :items="tag.categories || undefined"
        :grid-options="categoryOptions"
        show-chips
        multiple
        class="ma-4"
        :errors="chipErrors"
      >
        <template #item.name="{ item }">
          <router-link :to="{ name: 'category-update', params: { id: item.id } }">
            {{ item.name }}
          </router-link>
        </template>
      </selectable-categories>
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import SelectableTaxonomies from '@/components/common/selectables/resources/SelectableTaxonomies.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'TagCategoryIds',

  components: {
    SelectableResourceHeader,
    SelectableTaxonomies,
    SelectableCategories,
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
      set: (val) => emit('input', val)
    })

    const categoryOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    const chipErrors = computed(() => getChipErrors('category_ids', props.errors))

    return {
      tag,
      categoryOptions,
      chipErrors
    }
  }
})
</script>
