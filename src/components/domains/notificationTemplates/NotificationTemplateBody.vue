<template>
  <div class="d-flex flex-column">
    <div class="d-flex justify-space-between align-center">
      <span>{{ $t('Body') }}:</span>
      <notification-template-body-macros-dialog :value="value" @apply="onApplyMacro" />
    </div>
    <html-editor
      :key="lastInsert"
      v-bind="$attrs"
      v-model="body"
      class="d-flex flex-column flex-gap-16"
      :quill.sync="quill"
    />
    <div class="d-flex flex-column my-4 flex-gap-16">
      <span class="grey--text">{{ $t('if-else statement example') }}:</span>
      <div class="d-flex flex-gap-16">
        <div class="d-flex flex-column text-caption grey--text">
          <pre>{{ ifElseExplainer.map(({ line }) => line).join('\n') }}</pre>
        </div>
        <div class="d-flex flex-column text-caption grey--text">
          <pre>{{ ifElseExplainer.map(({ explainer }) => explainer).join('\n') }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import HtmlEditor from '@/components/common/HtmlEditor.vue'
import NotificationTemplateBodyMacrosDialog from '@/components/domains/notificationTemplates/NotificationTemplateBodyMacrosDialog.vue'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'
import type { Quill } from 'quill'

export default defineComponent({
  name: 'NotificationTemplateBody',

  components: { NotificationTemplateBodyMacrosDialog, HtmlEditor },

  props: {
    value: {
      type: Object as PropType<NotificationTemplate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const lastInsert = ref('')

    const body = computed({
      get: () => props.value.body,
      set: (body) => emit('input', { ...props.value, body })
    })

    const onApplyMacro = (value: string) => {
      quill.value?.focus()
      quill.value?.insertText(quill.value?.getSelection()?.index || 0, value)
    }

    const quill = ref<Quill>()

    const ifElseExplainer = computed((ctx) => {
      return [
        { line: '{{#image_url}}', explainer: `${ctx.$t('beginning of the "if" statement')}` },
        { line: '  {{image_url}}', explainer: `${ctx.$t('content when "if" statement passes with given value')}` },
        { line: '{{/image_url}}', explainer: `${ctx.$t('end of the "if" statement')}` },
        { line: '{{^image_url}}', explainer: `${ctx.$t('beginning of the "else" statement')}` },
        { line: '  content', explainer: `${ctx.$t('content when "if" statement is not passing')}` },
        { line: '{{/image_url}}', explainer: `${ctx.$t('end of the "else" statement')}` }
      ]
    })

    return {
      body,
      lastInsert,
      ifElseExplainer,
      quill,
      onApplyMacro
    }
  }
})
</script>
