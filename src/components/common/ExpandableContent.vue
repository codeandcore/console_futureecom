<template>
  <v-sheet :outlined="outlined" rounded class="d-flex">
    <v-sheet :outlined="outlined" :color="expanded ? stripeColorOnExpand : stripeColor" :width="width" />
    <v-list class="my-0 py-0 flex-grow-1">
      <v-list-group v-model="expanded" no-action append-icon="" color="" v-bind="$attrs">
        <template #activator>
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <slot name="title" />
              <div>
                <v-icon v-if="showExpand" class="mx-4">
                  {{ expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                </v-icon>
                <slot name="after-icon" />
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <slot name="content" />
      </v-list-group>
    </v-list>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'ExpandableContent',

  props: {
    stripeColor: {
      type: String,
      default: 'transparent'
    },
    stripeColorOnExpand: {
      type: String,
      default: 'primary'
    },
    width: {
      type: Number,
      default: 4
    },
    showExpand: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const expanded = ref(false)

    return {
      expanded
    }
  }
})
</script>
