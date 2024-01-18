<template>
  <html-editor
    v-bind="$attrs"
    :editor-options="{ theme: 'snow', modules: { toolbar: false } }"
    :label="$t('Scripts')"
    :value="value"
    :quill.sync="quill"
    @input="onTextChange"
  />
</template>

<script lang="ts">
import 'quill/dist/quill.snow.css'
import { defineComponent, ref } from '@vue/composition-api'
import HtmlEditor from './HtmlEditor.vue'
import Quill from 'quill'

export default defineComponent({
  name: 'ScriptEditor',

  components: { HtmlEditor },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  emits: {
    input: (_body: string): boolean => true
  },

  setup(props, { emit }) {
    const quill = ref<Quill>()

    const onTextChange = () => emit('input', quill.value?.getText() || '')

    return {
      quill,
      onTextChange
    }
  }
})
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.ql-editor {
  counter-reset: line;
  max-height: 250px;
  overflow: auto;

  p:before {
    width: 50px;
    text-align: right;
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    border-right: 1px solid map-get($grey, base);
    padding: 0 0.5em;
    margin-right: 0.5em;
    color: map-get($grey, base);
  }
}

.v-application--is-rtl {
  .ql-editor {
    direction: rtl;

    p {
      text-align: right;
      padding-right: 0;

      &:before {
        text-align: left;
        margin-left: 0.5em;
        border-left: 1px solid #ddd;
        border-right: none;
      }
    }
  }
}
</style>
