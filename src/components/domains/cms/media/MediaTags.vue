<template>
  <v-combobox
    v-bind="$attrs"
    v-model="tags"
    hide-details="auto"
    outlined
    :label="$t('Tags')"
    chips
    deletable-chips
    multiple
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MediaTags',

  props: {
    value: {
      type: Object as PropType<{ tags?: string[] | null }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tags = computed({
      get: () => props.value.tags,
      set: (tags) => emit('input', { ...props.value, tags })
    })

    return {
      tags
    }
  }
})
</script>
