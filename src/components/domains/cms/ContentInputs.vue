<template>
  <div>
    <label>
      <span>{{ label }}</span>
    </label>
    <html-editor v-if="type === 'raw_html'" v-bind="$attrs" v-model="content" />
    <json-editor v-else v-bind="$attrs" v-model="content" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import HtmlEditor from '@/components/common/HtmlEditor.vue'
import JsonEditor from '@/components/common/JsonEditor.vue'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ContentInput',

  components: { HtmlEditor, JsonEditor },

  props: {
    value: {
      type: [] as PropType<null | string>,
      required: true
    },
    type: {
      type: String as PropType<'raw_html' | 'json'>,
      default: 'raw_html'
    },
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    }
  },

  setup(props, { emit }) {
    const content = computed({
      get: () => props.value,
      set: (content) => emit('input', content ? content : null)
    })

    return {
      content
    }
  }
})
</script>
