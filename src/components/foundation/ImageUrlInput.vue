<template>
  <div class="d-flex flex-column flex-gap-16 flex-column">
    <div class="d-flex flex-gap-16 justify-space-between">
      <div class="d-flex flex-column">
        <span :class="errorMessage ? 'error--text' : 'grey--text text--darken-2'">{{ $t(`${label}`) }}</span>
        <span v-if="errorMessage" class="error--text text-caption">{{ errorMessage }}</span>
      </div>

      <v-btn-toggle v-model="mediaChoice" color="primary" dense mandatory>
        <v-btn v-if="image" value="preview" small>
          {{ $t('Preview') }}
        </v-btn>
        <v-btn v-if="canCreate" value="upload" small>
          {{ $t('Upload') }}
        </v-btn>
        <v-btn value="library" small>
          {{ $t('Media Library') }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-slide-y-reverse-transition mode="out-in">
      <image-dropzone
        v-if="mediaChoice === 'upload'"
        :loading="loading"
        :label="$t('Drop image to upload')"
        @input="onImageDrop"
      />
      <v-card v-if="mediaChoice === 'library'" outlined>
        <selectable-media v-model="media" class="pa-6" @input="image = $event.secure_url" />
      </v-card>
      <div v-if="mediaChoice === 'preview'" class="d-flex justify-center">
        <image-upload-preview :value="image || ''" @input="onImageDelete" />
      </div>
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { transformMediaToFormData } from '@/libs/domains/cms/media/formatMedia'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ImageDropzone from '@/components/common/imageUpload/ImageDropzone.vue'
import ImageUploadPreview from '@/components/common/imageUpload/ImageUploadPreview.vue'
import SelectableMedia from '@/components/common/selectables/resources/SelectableMedia.vue'
import useApi from '@/composable/useApi'
import type { Media } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ImageUrlInput',
  components: { SelectableMedia, ImageDropzone, ImageUploadPreview },

  props: {
    value: {
      type: Object as PropType<Partial<Record<'image_url' | 'image' | 'url' | 'logo', string | null>>>,
      required: true
    },
    valueKey: {
      type: [] as PropType<'image_url' | 'image' | 'url' | 'logo'>,
      default: 'image_url'
    },
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: 'Image'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const { canCreate } = useCrudChecker('cms\\media')

    const api = useApi()
    const loading = ref(false)

    const image = computed({
      get: () => props.value[props.valueKey],
      set: (image) => emit('input', { ...props.value, [props.valueKey]: image })
    })

    const getMediaChoice = (): 'upload' | 'library' => (canCreate.value ? 'upload' : 'library')

    const mediaChoice = ref<'preview' | 'upload' | 'library'>(image.value ? 'preview' : getMediaChoice())

    const media = ref<Media>()

    const onImageDrop = (files: File[]) => {
      loading.value = true

      api.cms
        .createMedia(transformMediaToFormData({ name: files[0].name, image: files[0] }))
        .then((val) => {
          image.value = val.secure_url
          mediaChoice.value = 'preview'
        })
        .catch((err) => addErrorToast(err.response?.data.message || t(`Unable to upload image`)))
        .finally(() => (loading.value = false))
    }

    const onImageDelete = () => {
      media.value = undefined
      image.value = null
      mediaChoice.value = getMediaChoice()
    }

    return {
      image,
      loading,
      canCreate,
      media,
      mediaChoice,
      onImageDrop,
      onImageDelete
    }
  }
})
</script>
