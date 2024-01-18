<template>
  <div data-cy="image-upload-preview">
    <div v-if="hasValidImage !== false" class="d-flex">
      <div class="d-flex justify-end" :class="{ 'ma-4': showDelete }">
        <v-btn
          v-if="hasValidImage && showDelete"
          data-cy="image-delete-btn"
          fab
          depressed
          x-small
          color="error"
          absolute
          height="20"
          width="20"
          class="ma-n2"
          @click="deleteImage"
        >
          <v-icon x-small>clear</v-icon>
        </v-btn>
        <v-img
          v-if="image"
          data-cy="image-upload-preview-img"
          :src="image"
          :max-width="previewSize"
          :max-height="previewSize"
          contain
          @load="onLoad"
          @error="onError"
        />
      </div>
    </div>
    <span v-else-if="!hasValidImage" class="text-caption grey--text" data-cy="image-upload-preview-error">
      {{ $t('Unable to render preview') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ImageUploadPreview',

  props: {
    value: {
      type: [] as PropType<File | string>,
      default: ''
    },
    previewSize: {
      type: Number,
      default: 128
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },

  emits: {
    input: (_: File | null) => true,
    delete: () => true
  },

  setup(props, { emit }) {
    const hasValidImage = ref<boolean>()

    const image = computed(() => {
      if (!props.value) {
        return undefined
      }

      return typeof props.value === 'string' ? props.value : URL.createObjectURL(props.value)
    })

    const deleteImage = (): void => emit('input', null)

    const onLoad = () => (hasValidImage.value = true)

    const onError = () => (hasValidImage.value = false)

    return {
      image,
      hasValidImage,
      deleteImage,
      onLoad,
      onError
    }
  }
})
</script>
