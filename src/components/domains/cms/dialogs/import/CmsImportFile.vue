<template>
  <v-file-input
    v-model="file"
    outlined
    v-bind="$attrs"
    hide-details="auto"
    :label="$t('Import file')"
    prepend-icon="mdi-file"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CmsImportData } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CmsImportFile',

  props: {
    value: {
      type: Object as PropType<CmsImportData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const file = computed({
      get: () => props.value.file,
      set: (file) => emit('input', { ...props.value, file })
    })

    return {
      file
    }
  }
})
</script>
