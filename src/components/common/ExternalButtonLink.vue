<template>
  <v-btn depressed small v-bind="$attrs" :href="`//${value}`" target="_blank">
    {{ label }}
    <v-divider vertical class="mx-2" />
    <v-icon small class="mx-2">arrow_outward</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ExternalButtonLink',

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
