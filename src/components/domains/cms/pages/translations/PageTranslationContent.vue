<template>
  <content-input v-model="content" v-bind="$attrs" :type="value.type" :label="$t('Content')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ContentInput from '@/components/domains/cms/ContentInputs.vue'
import dotProp from 'dot-prop'
import type { Block } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PageTranslationContent',
  components: { ContentInput },

  props: {
    value: {
      type: Object as PropType<Block>,
      required: true
    },
    translationCode: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const translationPath = computed(() => `translations.${props.translationCode}.content`)

    const content = computed({
      get: () => dotProp.get(props.value, translationPath.value, ''),
      set: (content) => {
        const val = { ...dotProp.set(props.value, translationPath.value, content || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      content
    }
  }
})
</script>
