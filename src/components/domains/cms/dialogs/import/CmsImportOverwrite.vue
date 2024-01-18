<template>
  <switch-field v-model="overwrite" :label="$t('Overwrite')" v-bind="$attrs" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CmsImportData } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CmsImportOverwrite',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CmsImportData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const overwrite = computed({
      get: () => Boolean(props.value.overwrite),
      set: (overwrite) => emit('input', { ...props.value, overwrite })
    })

    return {
      overwrite
    }
  }
})
</script>
