<template>
  <div class="d-flex flex-column flex-gap-8" :class="{ 'error--text': hasErrors }">
    <slot name="title">
      <span>{{ title }} {{ itemCount ? `(${itemCount})` : textOnEmpty }}</span>
    </slot>
    <slot name="subtitle" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SelectableResourceHeader',

  props: {
    title: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    items: {
      type: [] as PropType<unknown[] | null>,
      default: undefined
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      default: () => ({})
    },
    textOnEmpty: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const itemCount = computed(() => (props.items || []).filter(Boolean).length)
    const hasErrors = computed(() => Object.keys(removeEmptyFields(props.errors, { emptyString: true }) || {}).length)

    return {
      itemCount,
      hasErrors
    }
  }
})
</script>
