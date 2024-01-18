<template>
  <v-list>
    <v-list-group v-if="showExpand" color="">
      <template #activator>
        <v-list-item-title class="d-flex justify-space-between align-center">
          <span v-if="title">{{ $t(title) }}</span>
          <slot v-else name="title" />
          <slot name="before-icon" />
        </v-list-item-title>
      </template>
      <slot name="content" />
    </v-list-group>
    <v-list-item v-else>
      <v-list-item-title class="d-flex justify-space-between align-center">
        <span v-if="title">{{ $t(title) }}</span>
        <slot v-else name="title" />
        <div class="me-16">
          <slot name="before-icon" />
        </div>
      </v-list-item-title>
      <slot name="content" />
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderExpansionList',

  props: {
    title: {
      type: String,
      default: ''
    },
    showExpand: {
      type: Boolean,
      default: false
    }
  }
})
</script>
