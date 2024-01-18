<template>
  <div v-if="isSupported" class="d-flex flex-gap-16 align-center" data-cy="copy-button-action">
    <v-slide-y-reverse-transition mode="out-in">
      <span v-if="copied" class="green--text font-weight-medium" data-cy="copy-button-action-copied">
        {{ $t('Copied') }}
        <v-icon color="green">check</v-icon>
      </span>
      <v-icon v-else data-cy="copy-button-action-icon" @click="copy(value)">content_copy</v-icon>
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useClipboard } from '@vueuse/core'

export default defineComponent({
  name: 'CopyButtonAction',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup() {
    const { copy, copied, isSupported } = useClipboard()

    return {
      copy,
      copied,
      isSupported
    }
  }
})
</script>
