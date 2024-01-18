<template>
  <div class="json-editor">
    <span>{{ label }}</span>
    <rule-validator v-model="content" :rules="rules" />
    <JsonEditorVue v-model="content" :navigation-bar="false" mode="text" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { parseJsonToString } from '@/composable/useCms'
import JsonEditorVue from 'json-editor-vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'JsonEditor',
  components: { JsonEditorVue, RuleValidator },
  props: {
    value: {
      type: [] as PropType<string>,
      default: ''
    },
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const content = computed({
      get: () => props.value,
      set: (content) => emit('input', parseJsonToString(content))
    })

    return {
      content
    }
  }
})
</script>
<style lang="scss">
@import '@/assets/scss/helpers/_json-editor.scss';
</style>
