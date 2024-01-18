<template>
  <div>
    <span
      :class="{ 'required': required, 'error--text': errorMessage, 'grey--text text--darken-2': !errorMessage }"
      class="d-flex flex-column mb-2"
    >
      <label>{{ $t(`${label}`) }}</label>
      <slot name="error">
        <span v-if="errorMessage" class="text-caption">{{ errorMessage }}</span>
      </slot>
    </span>
    <div>
      <div ref="quillEditorRef" />
    </div>
    <quill-link-dialog :value="linkDialog" @apply="onLinkApplied" @close="linkDialog = false" />
    <quill-image-dialog :value="imageDialog" @apply="onImageApplied" @close="imageDialog = false" />
  </div>
</template>

<script lang="ts">
import 'quill/dist/quill.snow.css'
import Quill from 'quill'

import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import QuillImageDialog from '@/components/common/quill/QuillImageDialog.vue'
import QuillLinkDialog from '@/components/common/quill/QuillLinkDialog.vue'
import type { PropType } from '@vue/composition-api'
import type { QuillOptionsStatic, SelectionChangeHandler, TextChangeHandler } from 'quill'
import type { RangeStatic } from 'quill'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'HtmlEditor',

  components: { QuillImageDialog, QuillLinkDialog },

  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    editorOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      default: null
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  emits: {
    'input': (_body: string): boolean => true,
    'update:cursor-position': (_: RangeStatic): boolean => true,
    'update:quill': (_: Quill): boolean => true
  },

  setup(props, { emit }) {
    const quillEditorRef = ref<any>(null)

    const toolbar: Record<string, any> = [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      [{ font: [] }],
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        { color: [] },
        { background: [] },
        { script: 'sub' },
        { script: 'super' }
      ],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ direction: 'rtl' }],

      ['clean']
    ]

    const quillOptions: QuillOptionsStatic = {
      theme: 'snow',
      modules: { toolbar },
      ...props.editorOptions
    }

    let quill: Quill

    const openedDialog = ref<'link' | 'image' | null>(null)

    const linkDialog = computed({
      get: () => openedDialog.value === 'link',
      set: (val) => (openedDialog.value = val ? 'link' : null)
    })

    const imageDialog = computed({
      get: () => openedDialog.value === 'image',
      set: (val) => (openedDialog.value = val ? 'image' : null)
    })

    const imageHandler = () => (openedDialog.value = 'image')
    const linkHandler = (val: unknown) => (val ? (openedDialog.value = 'link') : quill.format('link', null))

    const onImageApplied = (url: string) => {
      quill.focus()
      quill.insertEmbed(quill.getSelection()?.index || 0, 'image', url)
      quill.setSelection(quill.getLength(), 0)
      linkDialog.value = false
    }

    const onLinkApplied = (url: string) => {
      quill.format('link', url)
      linkDialog.value = false
    }

    const onTextChange: TextChangeHandler = () => emit('input', quill.root.innerHTML)
    const onSelectionChange: SelectionChangeHandler = (cursor) => {
      if (openedDialog.value) {
        return
      }
      emit('update:cursor-position', cursor || { index: quill.getLength(), length: 0 })
    }

    onMounted(() => {
      quill = new Quill(quillEditorRef.value, { ...quillOptions })

      quill.clipboard.dangerouslyPasteHTML(props.value)

      quill.on('text-change', onTextChange)
      quill.on('selection-change', onSelectionChange)

      const toolbar = quill.getModule('toolbar')
      if (toolbar) {
        toolbar.addHandler('image', imageHandler)
        toolbar.addHandler('link', linkHandler)
      }

      emit('update:quill', quill)
    })

    return {
      quillEditorRef,
      linkDialog,
      imageDialog,
      onLinkApplied,
      onImageApplied
    }
  }
})
</script>

<style scoped lang="scss">
.ql-container {
  min-height: 230px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
