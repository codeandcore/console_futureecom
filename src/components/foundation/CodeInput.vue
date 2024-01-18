<template>
  <v-text-field
    v-model="code"
    v-bind="$attrs"
    data-cy="code-input"
    :label="$attrs.label || $t('Code')"
    hide-details="auto"
    outlined
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CodeInput',

  props: {
    value: {
      type: Object as PropType<{ code?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const code = computed({
      get: () => props.value.code,
      set: (code) => emit('input', { ...props.value, code })
    })

    return {
      code
    }
  }
})
</script>
