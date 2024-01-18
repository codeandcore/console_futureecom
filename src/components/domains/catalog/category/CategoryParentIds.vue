<template>
  <expandable-content outlined>
    <template #title>
      <span>
        {{ $t('Parent categories') }} {{ (value.parent_ids || []).length ? `(${value.parent_ids.length})` : '' }}
      </span>
    </template>
    <template #content>
      <v-divider />
      <selectable-categories
        v-model="categoryIds"
        :items="value.parent || undefined"
        :grid-options="categoryOptions"
        :request-options="{ filter: { id: { neq: value.id } } }"
        show-chips
        multiple
        class="ma-4"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'
import type { Category, CategoryFilter } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CategoryParentIds',
  components: { SelectableCategories, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Category>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const categoryIds = computed({
      get: () => ({ category_ids: props.value.parent_ids }),
      set: (value) => emit('input', { ...props.value, parent_ids: value.category_ids })
    })

    const categoryOptions = computed((): ResourceGridOptions<CategoryFilter> => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return {
        headers,
        filters: [{ code: 'code', label: '', type: 'text' }]
      }
    })

    return {
      categoryIds,
      categoryOptions
    }
  }
})
</script>
