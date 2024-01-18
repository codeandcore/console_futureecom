<template>
  <v-slide-y-transition mode="out-in">
    <div v-show="showAlert">
      <v-alert type="info" dismissible dense>
        {{ message }}
      </v-alert>
      <div class="d-flex justify-end mb-4">
        <v-btn small depressed @click="$emit('onClearClick')">
          {{ $t('Clear translations') }}
        </v-btn>
      </div>
    </div>
  </v-slide-y-transition>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ClearTranslationWarning',
  props: {
    showAlert: {
      type: Boolean,
      default: false
    },
    message: {
      type: [String, Number] as PropType<string | number | TranslateResult>,
      default: 'Partially translated inputs will not be saved'
    }
  }
})
</script>
