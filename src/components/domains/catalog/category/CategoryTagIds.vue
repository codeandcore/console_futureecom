<template>
  <expandable-content outlined>
    <template #title>
      <span>{{ $t('Linked tags') }} {{ (category.tag_ids || []).length ? `(${category.tag_ids.length})` : '' }}</span>
    </template>
    <template #content>
      <v-divider />
      <selectable-tags
        v-model="category"
        :items="category.tags || undefined"
        :grid-options="tagOptions"
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
import SelectableTags from '@/components/common/selectables/resources/SelectableTags.vue'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CategoryTagIds',

  components: { SelectableTags, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Partial<Category>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const category = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const tagOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [{ text: t('Name'), value: 'name', sortable: false }]

      return { headers }
    })

    return {
      category,
      tagOptions
    }
  }
})
</script>
