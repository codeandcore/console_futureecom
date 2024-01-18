<template>
  <select-multiple-cms-parts v-model="parts" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectMultipleCmsParts from '@/components/common/selectables/SelectMultipleCmsParts.vue'
import type { CmsImportData } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CmsImportParts',

  components: { SelectMultipleCmsParts },

  props: {
    value: {
      type: Object as PropType<CmsImportData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const parts = computed({
      get: () => props.value.parts,
      set: (parts) => emit('input', { ...props.value, parts: parts || [] })
    })

    return {
      parts
    }
  }
})
</script>
