<template>
  <expandable-content outlined>
    <template #title>
      <span>
        {{ $t('Child categories') }}
        {{ (value.children_ids || []).length ? `(${value.children_ids.length})` : '' }}
      </span>
    </template>
    <template #content>
      <v-divider />
      <selectable-categories
        v-model="category"
        :items="value.children || undefined"
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
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CategoryChildrenIds',
  components: { SelectableCategories, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Category>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const category = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const categoryOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    return {
      category,
      categoryOptions
    }
  }
})
</script>
