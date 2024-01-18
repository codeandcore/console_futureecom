<template>
  <div>
    <cms-import-file v-model="cmsImport" :rules="rules.file" />
    <cms-import-overwrite v-model="cmsImport" />
    <cms-import-parts v-model="cmsImport" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import CmsImportFile from '@/components/domains/cms/dialogs/import/CmsImportFile.vue'
import CmsImportOverwrite from '@/components/domains/cms/dialogs/import/CmsImportOverwrite.vue'
import CmsImportParts from '@/components/domains/cms/dialogs/import/CmsImportParts.vue'
import type { CmsImportData } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CmsImportInputs',

  components: { CmsImportParts, CmsImportOverwrite, CmsImportFile },

  props: {
    value: {
      type: Object as PropType<CmsImportData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const cmsImport = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      file: [(val: File): ValidationRule => useNotEmptyValidationRule(val)]
    }

    return {
      cmsImport,
      rules
    }
  }
})
</script>
