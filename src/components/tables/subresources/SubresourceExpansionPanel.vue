<template>
  <v-list>
    <v-list-group v-model="open" no-action append-icon color="" :disabled="!canCreate">
      <v-list-item-content slot="activator" class="flex-grow-1">
        <v-list-item-title class="d-flex justify-space-between align-center flex-grow-1">
          <slot name="header" />
          <div v-if="canCreate">
            <v-btn color="primary">
              <v-icon>{{ open ? 'remove' : 'add' }}</v-icon>
            </v-btn>
            <slot name="after-icon" />
          </div>
        </v-list-item-title>
      </v-list-item-content>

      <slot name="content" />
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'SubresourceExpansionPanel',

  props: {
    canCreate: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const open = ref(false)

    return {
      open
    }
  }
})
</script>
