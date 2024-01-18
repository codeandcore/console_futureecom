<template>
  <a :href="`//${value}`" target="_blank">
    <span>{{ label }}</span>
    <v-icon small class="mx-2">arrow_outward</v-icon>
  </a>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ExternalLink',

  props: {
    label: {
      type: [] as PropType<string | TranslateResult>,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
})
</script>
