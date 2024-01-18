<template>
  <div class="d-flex flex-column flex-gap-16">
    <span>{{ $t('Propagate restrictions to:') }}</span>
    <v-data-table :value="propagateTo" :headers="headers" :items="children" item-key="id" show-select @input="onSelect">
      <template #no-data>
        <div class="my-4">
          <span class="d-block">{{ $t('No children selected to propagate') }}.</span>
          <span>{{ $t('Select them first ') }}</span>
          <router-link :to="{ params: { option: 'relations' } }">{{ $t('here') }}.</router-link>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyPropagateTo',

  props: {
    value: {
      type: Object as PropType<{ children: Taxonomy['children']; propagate_to: string[] }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const children = computed(() => props.value.children)
    const propagateTo = computed(() => (props.value.propagate_to || []).map((id) => ({ id })))

    const onSelect = (val: Taxonomy[]) => {
      const propagate_to = val.map((item) => item.id)
      emit('input', { ...props.value, propagate_to })
    }

    const headers = computed((): ResourceGridOptions['headers'] => [
      { text: t('Name'), value: 'name' },
      { text: t('Code'), value: 'code' }
    ])

    return {
      onSelect,
      children,
      propagateTo,
      headers
    }
  }
})
</script>
