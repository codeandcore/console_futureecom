<template>
  <v-btn v-bind="$attrs" depressed data-cy="generate-slug-button-action" @click="$emit('input', getSlugify(value))">
    {{ $t('Generate') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { getSlugify } from '@/composable/useSlugify'

export default defineComponent({
  name: 'GenerateSlug',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup() {
    return {
      getSlugify
    }
  }
})
</script>
