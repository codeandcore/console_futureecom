<template>
  <div class="d-flex flex-column flex-gap-16">
    <image-dropzone @input="image = $event[0]" />
    <div v-if="image" class="d-flex grey--text text--darken-2 text-caption justify-center align-center flex-gap-32">
      <image-upload-preview v-model="image" :show-delete="!isUrl" />
      <media-data v-if="isUrl" :value="value" metadata-only />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { isFile } from '@/libs/objects'
import ImageDropzone from '@/components/common/imageUpload/ImageDropzone.vue'
import ImageUploadPreview from '@/components/common/imageUpload/ImageUploadPreview.vue'
import MediaData from './MediaData.vue'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MediaImage',

  components: {
    MediaData,
    ImageUploadPreview,
    ImageDropzone
  },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<{ image?: File; name?: string; secure_url?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const image = computed({
      get: () => props.value.image || props.value.secure_url,
      set: (image) => {
        const imageName = isFile(image) ? image.name : image
        const name = props.value.name || (imageName || '').split('.')[0]
        emit('input', { ...props.value, image, name })
      }
    })

    const isUrl = computed(() => props.value.secure_url === image.value)

    return {
      image,
      isUrl
    }
  }
})
</script>
