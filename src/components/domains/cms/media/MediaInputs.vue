<template>
  <div>
    <media-name v-model="media" :error-messages="errors['name']" class="required" />
    <media-description v-model="media" :error-messages="errors['description']" />
    <div class="d-flex flex-column flex-gap-8">
      <span class="required d-flex flex-column" :class="errors['image'] ? 'error--text' : 'grey--text text--darken-2'">
        <label>{{ $t('Image') }}</label>
        <span class="text-caption" v-text="errors['image']" />
      </span>
      <media-image v-model="media" />
    </div>
    <media-tags v-model="media" :error-messages="errors['tags']" />
    <div class="d-flex flex-column flex-gap-8">
      <media-public-id v-model="media" :error-messages="errors['public_id']" :disabled="!!media.id" />
      <span class="text-caption grey--text">
        {{ $t('Public ID replaces the image file name in the URL with provided one') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DescriptionInput from '@/components/foundation/DescriptionInput.vue'
import MediaImage from '@/components/domains/cms/media/MediaImage.vue'
import MediaPublicId from '@/components/domains/cms/media/MediaPublicId.vue'
import MediaTags from '@/components/domains/cms/media/MediaTags.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import type { PropType } from '@vue/composition-api'
import type { UpdateMedia } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'MediaInputs',

  components: {
    MediaTags,
    MediaPublicId,
    MediaImage,
    MediaName: NameInput,
    MediaDescription: DescriptionInput
  },

  props: {
    value: {
      type: Object as PropType<UpdateMedia>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const media = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      media
    }
  }
})
</script>
