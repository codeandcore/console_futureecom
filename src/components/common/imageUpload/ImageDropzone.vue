<template>
  <div style="border: dashed 2px grey" class="rounded">
    <v-sheet
      ref="dropzoneRef"
      color="grey lighten-2"
      class="pa-6 d-flex flex-gap-16 rounded align-center justify-center"
    >
      <v-slide-y-reverse-transition mode="out-in">
        <div v-if="!loading">
          <v-slide-y-reverse-transition mode="out-in">
            <div v-if="!isOverDropZone" class="d-flex flex-gap-16 align-center">
              <span class="grey--text text--darken-2">{{ $t(`${label}`) }}</span>
              <v-divider vertical />
              <v-btn color="primary" depressed small @click="open">
                {{ $t('Choose file') }}
              </v-btn>
            </div>
            <slot v-else name="hover">
              <span class="d-flex flex-column grey--text text--darken-2">
                <v-icon>cloud_upload</v-icon>
                <span>{{ $t('Upload image') }}</span>
              </span>
            </slot>
          </v-slide-y-reverse-transition>
        </div>
        <slot v-else name="loading">
          <v-progress-circular size="32" color="primary" indeterminate />
        </slot>
      </v-slide-y-reverse-transition>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useDropZone, useFileDialog } from '@vueuse/core'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ImageDropzone',
  props: {
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: 'Drop image here'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    input: (_: File[]) => true
  },

  setup(props, { emit }) {
    const dropzoneRef = ref<HTMLDivElement>()

    const { files, open } = useFileDialog({ accept: 'image/*' })

    const onImageUpload = (files: File[] | null) => files && emit('input', files)

    const { isOverDropZone } = useDropZone(dropzoneRef, onImageUpload)

    watch(files, (val: FileList | null) => onImageUpload(Array.from(val || [])))

    return {
      dropzoneRef,
      isOverDropZone,
      open
    }
  }
})
</script>
