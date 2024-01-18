<template>
  <v-dialog :value="value" width="800" @input="onChange">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>{{ $t('Select image') }}</span>
        <v-icon @click="onChange(false)">close</v-icon>
      </v-card-title>
      <v-divider class="mb-4" />
      <v-card-text>
        <image-url-input v-model="selected" value-key="url" label="" />
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-end">
        <v-btn depressed color="primary" :disabled="!selected.url" @click="applied">
          {{ $t('Apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'

export default defineComponent({
  name: 'QuillImageDialog',
  components: { ImageUrlInput },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    close: (_: boolean) => true,
    apply: (_: string) => true
  },

  setup(props, { emit }) {
    const selected = ref({ url: null })

    const onChange = (val: boolean) => {
      emit('close', val)
      if (!val) {
        selected.value = { url: null }
      }
    }

    const applied = () => {
      emit('apply', selected.value?.url || '')
      onChange(false)
    }

    return {
      selected,
      applied,
      onChange
    }
  }
})
</script>
