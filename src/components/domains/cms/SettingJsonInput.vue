<template>
  <div class="json-editor">
    <span class="grey--text text--darken-2">{{ label }}</span>
    <JsonEditorVue v-model="json" :navigation-bar="false" :mode="'text'" :on-change="onChange()" />
    <div class="text-caption red--text">
      {{ errors }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { parseJson, parseJsonToString, validJson } from '@/composable/useCms'
import { useSettingJsonValidation } from '@/composable/validators/useSettingValidation'
import JsonEditorVue from 'json-editor-vue'

export default defineComponent({
  name: 'SettingJsonInput',
  components: { JsonEditorVue },
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      required: true
    },
    rules: {
      type: Object,
      default: () => {}
    },
    breakpoints: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const errors = ref('')
    const json = ref(parseJsonToString(props.value))
    const value = parseJsonToString(parseJson(props.value))
    const onChange = async () => {
      if (!validJson(json.value) && !props.breakpoints) {
        errors.value = ''
        return
      }

      if (!validJson(json.value) && props.breakpoints && json.value.includes('{{value}}')) {
        errors.value = ''
        emit('input', json.value)
        return
      }

      errors.value = await useSettingJsonValidation(parseJson(json.value), props.rules)

      if (!errors.value.length && parseJsonToString(json.value) !== value) {
        emit('input', json.value)
      }
    }

    return {
      json,
      errors,
      onChange
    }
  }
})
</script>
<style lang="scss">
@import '@/assets/scss/helpers/_json-editor.scss';
</style>
