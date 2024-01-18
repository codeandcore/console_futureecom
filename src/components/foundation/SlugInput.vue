<template>
  <div class="d-flex flex-gap-16">
    <v-text-field
      v-bind="$attrs"
      v-model="slug"
      data-cy="slug-input"
      :label="$t('Slug')"
      outlined
      hide-details="auto"
    />
    <generate-slug-button-action :disabled="!name" :value="name" class="mt-3" @input="slug = $event" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import GenerateSlugButtonAction from '@/components/common/actions/GenerateSlugButtonAction.vue'
import dotProp from 'dot-prop'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SlugInput',

  components: { GenerateSlugButtonAction },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<{ slug?: string; name: string; translations?: Record<string, unknown> }>,
      required: true
    },
    translationCode: {
      type: String,
      default: ''
    },
    slugifyKey: {
      type: String,
      default: 'name'
    }
  },

  setup(props, { emit }) {
    const path = props.translationCode ? `translations.${props.translationCode.toLowerCase()}.slug` : ''

    const name = computed(() => {
      return props.translationCode
        ? dotProp.get(props.value, `translations.${props.translationCode.toLowerCase()}.${props.slugifyKey}`, 'name')
        : dotProp.get(props.value, props.slugifyKey, '')
    })

    const slug = computed({
      get: () => (!path ? props.value.slug : dotProp.get(props.value, path, '')),
      set: (slug) => {
        if (!path) {
          emit('input', { ...props.value, slug })
          return
        }
        const val = { ...dotProp.set(props.value, path, slug || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      slug,
      name
    }
  }
})
</script>
