<template>
  <html-editor v-bind="$attrs" v-model="description" :error-message="errorMessage" :label="label" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import HtmlEditor from '@/components/common/HtmlEditor.vue'
import dotProp from 'dot-prop'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'DescriptionInput',

  components: { HtmlEditor },

  props: {
    value: {
      type: Object as PropType<{ description?: string; translations?: Record<string, unknown> }>,
      required: true
    },
    errorMessage: {
      type: String,
      default: undefined
    },
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: 'Description'
    },
    translationCode: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const path = props.translationCode
      ? `translations.${props.translationCode.toLowerCase()}.description`
      : 'description'

    const description = computed({
      get: () => (!path ? props.value.description : dotProp.get(props.value, path, '')),
      set: (description) => {
        if (!path) {
          emit('input', { ...props.value, description })
          return
        }
        const val = { ...dotProp.set(props.value, path, description || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      description
    }
  }
})
</script>
