<template>
  <html-editor v-if="value.type === 'raw_html'" v-bind="$attrs" v-model="content" :label="$t('Content')" />
  <json-editor v-else v-bind="$attrs" v-model="content" :label="$t('Content')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import HtmlEditor from '@/components/common/HtmlEditor.vue'
import JsonEditor from '@/components/common/JsonEditor.vue'
import dotProp from 'dot-prop'
import type { Block } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BlockTranslationContent',
  components: { HtmlEditor, JsonEditor },

  props: {
    value: {
      type: Object as PropType<Block>,
      required: true
    },
    translationCode: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const translationPath = computed(() => `translations.${props.translationCode}.content`)

    const content = computed({
      get: () => dotProp.get(props.value, translationPath.value, ''),
      set: (content) => {
        const val = { ...dotProp.set(props.value, translationPath.value, content || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      content
    }
  }
})
</script>
