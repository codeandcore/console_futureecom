<template>
  <language-inputs v-model="language" :errors="languageErrors" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { mapErrors } from '@/composable/validator/useValidator'
import LanguageInputs from '@/components/domains/settings/forms/LanguageInputs.vue'
import type { NewStore } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'StoreLanguage',

  components: {
    LanguageInputs
  },

  props: {
    value: {
      type: Object as () => NewStore,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const language = computed({
      get: () => props.value.language,
      set: (language) => emit('input', { ...props.value, language })
    })

    const languageErrors = computed(() => mapErrors('language.', '', props.errors))

    return {
      language,
      languageErrors
    }
  }
})
</script>
