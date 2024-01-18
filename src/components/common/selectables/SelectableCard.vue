<template>
  <v-card
    v-bind="$attrs"
    :loading="loading"
    flat
    outlined
    :disabled="disabled"
    ripple
    v-on="$listeners"
    @click="$emit('onSelect')"
  >
    <template #progress>
      <v-progress-linear color="primary" height="4" indeterminate />
    </template>

    <v-card-text class="d-flex flex-column" :class="{ ' pa-0 ma-0': dense }">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectableCard',

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  }
})
</script>
