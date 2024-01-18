<template>
  <v-text-field
    v-model="name"
    v-bind="$attrs"
    data-cy="name-input"
    :label="$attrs.label || $t('Name')"
    hide-details="auto"
    outlined
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import dotProp from 'dot-prop'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'NameInput',

  props: {
    value: {
      type: Object as PropType<{ name?: string; translations?: Record<string, unknown> }>,
      required: true
    },
    translationCode: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const path = props.translationCode ? `translations.${props.translationCode.toLowerCase()}.name` : ''

    const name = computed({
      get: () => (!path ? props.value.name : dotProp.get(props.value, path, '')),
      set: (name) => {
        if (!path) {
          emit('input', { ...props.value, name })
          return
        }
        const val = { ...dotProp.set(props.value, path, name || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      name
    }
  }
})
</script>
